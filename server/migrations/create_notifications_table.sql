-- Migration: create_notifications_table.sql

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Index for scalable fetching based on receiver and read_status
CREATE INDEX IF NOT EXISTS idx_notifications_receiver ON public.notifications(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON public.notifications(read_status);

-- Enable RLS if needed, although backend handles insertions. 
-- In our case, the frontend listens via supabase realtime.
-- It's important that RLS policies exist if frontend reads directly.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can only update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can only delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = receiver_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
