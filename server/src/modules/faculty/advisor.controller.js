// modules/faculty/advisor.controller.js

const advisorService = require("./advisor.service");

exports.getMyStudents = async (req, res, next) => {
  try {
    const students = await advisorService.getMyStudents(req.user.id);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

exports.getStudentDocuments = async (req, res, next) => {
  try {
    const docs = await advisorService.getStudentDocuments(
      req.user.id,
      req.params.id
    );
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

exports.verifyDocument = async (req, res, next) => {
  try {
    const result = await advisorService.verifyDocument(
      req.user.id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.rejectDocument = async (req, res, next) => {
  try {
    const result = await advisorService.rejectDocument(
      req.user.id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};