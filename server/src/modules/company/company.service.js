const pool = require("../../config/db");

/*  COMPANY PROFILE*/

async function getCompanyProfile(userId) {
  const result = await pool.query(
    `SELECT c.*, u.email, u.fname, u.lname 
     FROM users u
     LEFT JOIN companies c ON u.user_id = c.user_id
     WHERE u.user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function updateCompanyProfile(userId, updateData) {
  const { company_name, website, industry, description, contact_person } = updateData;

  const result = await pool.query(
    `INSERT INTO companies (user_id, company_name, website, industry, description, contact_person)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       company_name = EXCLUDED.company_name,
       website = EXCLUDED.website,
       industry = EXCLUDED.industry,
       description = EXCLUDED.description,
       contact_person = EXCLUDED.contact_person
     RETURNING *`,
    [userId, company_name, website, industry, description, contact_person]
  );
  return result.rows[0];
}

/*PLACEMENT DRIVES*/

async function requestPlacementDrive(userId, driveData) {
  const { drive_date, start_time, end_time, mode, drive_type, location, meeting_link, min_cgpa, eligible_departments, registration_deadline, graduation_year } = driveData;

  if (min_cgpa !== undefined && (min_cgpa < 0 || min_cgpa > 10)) {
    throw new Error("Invalid CGPA requirement");
  }

  if (registration_deadline && new Date(registration_deadline) >= new Date(drive_date)) {
    throw new Error("Registration deadline must be before the drive date");
  }

  if (eligible_departments && eligible_departments.length > 0) {
    const validDeptRes = await pool.query(`SELECT DISTINCT department FROM students WHERE department IS NOT NULL`);
    const validDepts = validDeptRes.rows.map(r => r.department);
    for (const dept of eligible_departments) {
      if (!validDepts.includes(dept)) {
        throw new Error(`Invalid department: ${dept}`);
      }
    }
  }

  if (graduation_year) {
    const validYearRes = await pool.query(`SELECT DISTINCT graduation_year FROM students WHERE graduation_year IS NOT NULL`);
    const validYears = validYearRes.rows.map(r => r.graduation_year.toString());
    if (!validYears.includes(graduation_year.toString())) {
      throw new Error(`Invalid graduation year: ${graduation_year}`);
    }
  }

  const result = await pool.query(
    `INSERT INTO placement_drives 
     (company_id, drive_date, start_time, end_time, mode, drive_type, location, meeting_link, status, min_cgpa, eligible_departments, registration_deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9, $10, $11)
     RETURNING *`,
    [userId, drive_date, start_time, end_time, mode, drive_type, location, meeting_link, min_cgpa !== undefined ? min_cgpa : null, eligible_departments || null, registration_deadline || null]
  );
  
  const drive = result.rows[0];
  const notificationService = require("../notification/notification.service");
  
  const admins = await pool.query(`SELECT user_id FROM users WHERE role = 'admin'`);
  for (const admin of admins.rows) {
    try {
      await notificationService.createNotification(admin.user_id, `A new placement drive request for ${drive_type} is pending approval from company ID: ${userId}.`);
    } catch (e) {}
  }

  return drive;
}

async function getFormOptions() {
  const deptsRes = await pool.query(`SELECT DISTINCT department FROM students WHERE department IS NOT NULL`);
  const yearsRes = await pool.query(`SELECT DISTINCT graduation_year FROM students WHERE graduation_year IS NOT NULL ORDER BY graduation_year DESC`);
  return {
    departments: deptsRes.rows.map(r => r.department),
    graduation_years: yearsRes.rows.map(r => r.graduation_year)
  };
}

async function getMyDrives(userId) {
  const result = await pool.query(
    `SELECT * FROM placement_drives WHERE company_id = $1 ORDER BY drive_date DESC`,
    [userId]
  );
  return result.rows;
}

async function deleteDrive(companyId, driveId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //  Validate ownership
    const driveCheck = await client.query(
      `SELECT 1 
       FROM placement_drives 
       WHERE drive_id = $1 AND company_id = $2`,
      [driveId, companyId]
    );

    if (driveCheck.rows.length === 0) {
      throw new Error("Invalid drive ID or unauthorized");
    }

  
    await client.query(
      `DELETE FROM drive_registrations 
       WHERE drive_id = $1`,
      [driveId]
    );

    //  Delete drive → offers.drive_id becomes NULL automatically
    const result = await client.query(
      `DELETE FROM placement_drives 
       WHERE drive_id = $1 AND company_id = $2
       RETURNING *`,
      [driveId, companyId]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/*PLACEMENT OFFERS*/

async function createOffer(userId, offerData) {
  const { drive_id, title, description, package_lpa, location, acceptance_deadline } = offerData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //  Validate drive ownership + approval
    const driveCheck = await client.query(
      `SELECT 1 
       FROM placement_drives 
       WHERE drive_id = $1 
       AND company_id = $2 
       AND status = 'APPROVED'`,
      [drive_id, userId]
    );

    if (driveCheck.rows.length === 0) {
      throw new Error("Invalid drive ID or drive not yet approved by admin.");
    }

    // Create offer
    const offerRes = await client.query(
      `INSERT INTO placement_offers 
       (drive_id, company_id, title, description, package_lpa, location, acceptance_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [drive_id, userId, title, description, package_lpa, location, acceptance_deadline]
    );

    if (offerRes.rows.length === 0) {
      throw new Error("Failed to create offer");
    }

    const offer = offerRes.rows[0];

    //  STEP 1: Persist selected students as OFFERED
    await client.query(
        `INSERT INTO offer_applications (offer_id, student_id, status)
        SELECT $1, dr.student_id, 'offered'
        FROM drive_registrations dr
        WHERE dr.drive_id = $2
        AND dr.status = 'selected'
        AND NOT EXISTS (
            SELECT 1 
            FROM offer_applications oa
            JOIN placement_offers po ON oa.offer_id = po.offer_id
            WHERE oa.student_id = dr.student_id
            AND po.drive_id = dr.drive_id
    )`,
  [offer.offer_id, drive_id]
);

    //  STEP 2: Increment offers_received
    await client.query(
      `UPDATE students
       SET offers_received = offers_received + 1
       WHERE user_id IN (
         SELECT student_id
         FROM drive_registrations
         WHERE drive_id = $1
         AND status = 'selected'
       )`,
      [drive_id]
    );

    await client.query("COMMIT");

    const notificationService = require("../notification/notification.service");
    const offeredStudents = await pool.query(
      `SELECT student_id FROM drive_registrations WHERE drive_id = $1 AND status = 'selected'`,
      [drive_id]
    );
    for (const st of offeredStudents.rows) {
      try {
        await notificationService.createNotification(st.student_id, `You have received a new placement offer: ${title}.`);
      } catch (e) {}
    }

    return offer;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getMyOffers(userId) {
  const result = await pool.query(
    `SELECT po.offer_id,
    po.title,po.description,po.package_lpa,
    po.location,po.acceptance_deadline,
    po.created_at,po.drive_id,
    COALESCE(pd.drive_date::text, 'N/A') AS drive_date
    FROM placement_offers po
    LEFT JOIN placement_drives pd 
    ON po.drive_id = pd.drive_id
    WHERE po.company_id = $1
    ORDER BY po.created_at DESC;`,
    [userId]
  );
  return result.rows;
}

async function deleteOffer(companyId, offerId) {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Validate ownership
        const offerCheck = await client.query(
          `SELECT 1 FROM placement_offers 
          WHERE offer_id = $1 AND company_id = $2`,
          [offerId, companyId]
        );

        if (offerCheck.rows.length === 0) {
          throw new Error("Invalid offer ID or unauthorized");
        }

        //Check accepted offers
        const acceptCheck = await client.query(
          `SELECT COUNT(*) FROM offer_applications 
          WHERE offer_id = $1 AND status = 'accepted'`,
          [offerId]
        );

        if (parseInt(acceptCheck.rows[0].count) > 0) {
          throw new Error("Cannot delete offer. A student has already accepted it.");
        }

        //  Get affected students
        const studentsRes = await client.query(
          `SELECT student_id FROM offer_applications 
          WHERE offer_id = $1`,
          [offerId]
        );

        const studentIds = studentsRes.rows.map(r => r.student_id);

        // Decrement offers_received
        if (studentIds.length > 0) {
          await client.query(
            `UPDATE students
            SET offers_received = GREATEST(offers_received - 1, 0)
            WHERE user_id = ANY($1)`,
            [studentIds]
          );

          // Auto-update eligibility
          await client.query(
            `UPDATE students
            SET placement_eligible = TRUE
            WHERE user_id = ANY($1)
            AND offers_received < 2
            AND placement_status = 'NOT_PLACED'`,
            [studentIds]
          );
        }

        // Delete applications
        await client.query(
          `DELETE FROM offer_applications WHERE offer_id = $1`,
          [offerId]
        );

        // Get offer details for notification
        const offerRes = await client.query(
          `SELECT title FROM placement_offers WHERE offer_id = $1`,
          [offerId]
        );

        const offerTitle = offerRes.rows[0]?.title || "an offer";

        // Delete offer
        const result = await client.query(
          `DELETE FROM placement_offers 
          WHERE offer_id = $1 AND company_id = $2 
          RETURNING *`,
          [offerId, companyId]
        );

        await client.query("COMMIT");

        // Send notifications (outside transaction)
        const notificationService = require("../notification/notification.service");

        for (const studentId of studentIds) {
          try {
            await notificationService.createNotification(
              studentId,
              `An offer (${offerTitle}) has been withdrawn by the company.`
            );
          } catch (e) {}
        }

        return result.rows[0];

      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
}

/* APPLICANTS*/

async function getDriveApplicants(userId, driveId) {
  const result = await pool.query(
    `SELECT dr.*, u.fname, u.lname, u.email, s.cgpa, s.department
     FROM drive_registrations dr
     JOIN placement_drives pd ON dr.drive_id = pd.drive_id
     JOIN users u ON dr.student_id = u.user_id
     JOIN students s ON u.user_id = s.user_id
     WHERE pd.drive_id = $1 AND pd.company_id = $2`,
    [driveId, userId]
  );
  return result.rows;
}

async function updateApplicantStatus(userId, registrationId, status) {
  // Ensure the registration belongs to a drive owned by this company
  const result = await pool.query(
    `UPDATE drive_registrations dr
     SET status = $1
     FROM placement_drives pd
     WHERE dr.drive_id = pd.drive_id 
       AND pd.company_id = $2
       AND dr.registration_id = $3
     RETURNING dr.*`,
    [status, userId, registrationId]
  );

  if (result.rows.length === 0) {
    throw new Error("Applicant record not found or unauthorized");
  }
  
  const registration = result.rows[0];
  const notificationService = require("../notification/notification.service");
  try {
    await notificationService.createNotification(registration.student_id, `Your drive application status has been updated to: ${status}.`);
  } catch (e) {}

  return registration;
}
async function getOfferApplicants(companyId, offerId) {
        const offerRes = await pool.query(
          `SELECT * FROM placement_offers WHERE offer_id = $1 AND company_id = $2`,
          [offerId, companyId]
        );

        if (offerRes.rows.length === 0) {
          throw new Error("Offer not found or unauthorized");
        }

      const result = await pool.query(
      `SELECT
        oa.application_id,
        s.user_id AS student_id,
        u.fname,
        u.lname,
        s.department,
        s.cgpa,
        oa.status
      FROM offer_applications oa
      JOIN students s ON s.user_id = oa.student_id
      JOIN users u ON u.user_id = s.user_id
      WHERE oa.offer_id = $1
      AND oa.status IN ('offered', 'accepted')`,
      [offerId]
);

  return result.rows;
}

async function hireApplicant(companyId, applicationId) {
  const appRes = await pool.query(
    `SELECT oa.* FROM offer_applications oa
     JOIN placement_offers po ON oa.offer_id = po.offer_id
     WHERE oa.application_id = $1 AND po.company_id = $2`,
    [applicationId, companyId]
  );
  if (appRes.rows.length === 0) {
    throw new Error("Application not found or unauthorized");
  }

  const studentId = appRes.rows[0].student_id;

  const result = await pool.query(
    `UPDATE offer_applications
     SET status = 'offered', updated_at = NOW()
     WHERE application_id = $1
     RETURNING *`,
    [applicationId]
  );

  // Increment offers_received, but don't set placement_eligible to false unconditionally
  await pool.query(
    `UPDATE students
     SET offers_received = offers_received + 1
     WHERE user_id = $1`,
    [studentId]
  );

  // Check if offers bounds reached, then set eligibility
  const studentRes = await pool.query(
    `SELECT offers_received FROM students WHERE user_id = $1`,
    [studentId]
  );
  if (studentRes.rows[0].offers_received >= 2) {
    await pool.query(
      `UPDATE students SET placement_eligible = false WHERE user_id = $1`,
      [studentId]
    );
  }

  return result.rows[0];
}

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  requestPlacementDrive,
  getFormOptions,
  getMyDrives,
  deleteDrive,
  createOffer,
  getMyOffers,
  deleteOffer,
  getDriveApplicants,
  updateApplicantStatus,
  getOfferApplicants,
  hireApplicant
};
