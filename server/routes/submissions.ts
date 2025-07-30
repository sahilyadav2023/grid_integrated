import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

// GET /submissions/:uid → fetch task history for a user
// GET /submissions/:uid → fetch task history for a user
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // Step 1: Find internal user ID
    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: Fetch submissions for that user
    const { data, error } = await supabase
      .from('Submissions')
      .select(`
        id,
        submittedAt,
        status,
        declineReason,
        Tasks (
          title,
          points
        )
      `)
      .eq('userId', user.id)
      .order('submittedAt', { ascending: false });

    if (error) throw error;

    const history = data.map((entry) => {
      const task = Array.isArray(entry.Tasks) ? entry.Tasks[0] : entry.Tasks;
      return {
        id: entry.id,
        title: task?.title,
        points: task?.points,
        submittedAt: entry.submittedAt,
        status: entry.status,
        declineReason: entry.declineReason,
      };
    });

    res.json(history);
  } catch (err: any) {
    console.error("❌ Failed to fetch submissions:", err.message);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
});


// GET /submissions/pending/all → all pending submissions with task + user info
router.get('/pending/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Submissions')
      .select(`
        id,
        mediaUrl,
        submittedAt,
        status,
        Tasks (
          title,
          points
        ),
        Users (
          name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('submittedAt', { ascending: false });

    if (error) throw error;

    const pending = data.map((entry) => {
      const user = Array.isArray(entry.Users) ? entry.Users[0] : entry.Users;
      const task = Array.isArray(entry.Tasks) ? entry.Tasks[0] : entry.Tasks;

      return {
        id: entry.id,
        mediaUrl: entry.mediaUrl,
        submittedAt: entry.submittedAt,
        userName: user?.name,
        userEmail: user?.email,
        taskTitle: task?.title,
        taskPoints: task?.points,
      };
    });

    res.json(pending);
  } catch (err: any) {
    console.error("❌ Failed to fetch pending submissions:", err.message);
    res.status(500).json({ error: 'Failed to fetch pending submissions' });
  }
});

// POST /submissions/:id/decision → approve or decline a task
// POST /submissions/:id/decision → approve or reject task
router.post('/:id/decision', async (req, res) => {
  const { id } = req.params;
  const { decision, reason } = req.body;

  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }

  try {
    // 1. Fetch submission with user + task info
    const { data: submission, error: fetchError } = await supabase
      .from('Submissions')
      .select(`
        id,
        userId,
        taskId,
        Users ( id, points ),
        Tasks ( points )
      `)
      .eq('id', parseInt(id))
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const user = Array.isArray(submission.Users) ? submission.Users[0] : submission.Users;
    const task = Array.isArray(submission.Tasks) ? submission.Tasks[0] : submission.Tasks;

    // 2. If approved, update user points
    if (decision === "approved") {
      await supabase
        .from("Users")
        .update({
          points: (user?.points ?? 0) + (task?.points ?? 0),
        })
        .eq("id", user.id);
    }

    // 3. Update submission status
    const update = {
      status: decision,
      declineReason: decision === 'rejected' ? reason : null,
      updatedAt: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('Submissions')
      .update(update)
      .eq('id', parseInt(id));

    if (updateError) throw updateError;

    res.json({ message: `Submission ${decision}` });
  } catch (err: any) {
    console.error("❌ Admin decision failed:", err.message);
    res.status(500).json({ error: 'Failed to process submission', detail: err.message });
  }
});


export default router;