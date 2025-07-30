import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

// POST /tasks/submit - submit task (no points awarded here)
router.post('/submit', async (req, res) => {
  const { uid, taskId, mediaUrl } = req.body;

  if (!uid || !taskId || !mediaUrl) {
    return res.status(400).json({ error: 'Missing uid, taskId, or mediaUrl' });
  }

  try {
    // 1. Get internal user ID
    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('uid', uid)
      .single();

    if (userError || !user) {
      console.error("❌ User fetch failed:", userError?.message);
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Check if already submitted
    const { data: existing } = await supabase
      .from('Submissions')
      .select('id')
      .eq('taskId', taskId)
      .eq('userId', user.id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Task already submitted' });
    }

    // 3. Create submission with status = 'pending'
    const { error: insertError } = await supabase.from('Submissions').insert([
      {
        taskId,
        userId: user.id,
        mediaUrl,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    if (insertError) {
      console.error("❌ Insert failed:", insertError.message);
      return res.status(500).json({ error: "Insert failed", detail: insertError.message });
    }

    console.log("🎉 Task submission created (pending)");
    res.json({ message: "Task submitted for review." });
  } catch (err: any) {
    console.error("🔥 Submit error:", err.message);
    res.status(500).json({ error: "Submission failed", detail: err.message });
  }
});

// GET /tasks → return all tasks for students
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Tasks')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error("❌ Failed to fetch tasks:", err.message);
    res.status(500).json({ error: "Failed to fetch tasks", detail: err.message });
  }
});
// GET /tasks/unsubmitted/:uid → return tasks not submitted by the user
router.get('/unsubmitted/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // 1. Get internal user ID
    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Get submitted task IDs
    const { data: submittedTasks } = await supabase
      .from('Submissions')
      .select('taskId')
      .eq('userId', user.id);

    const submittedIds = submittedTasks?.map(t => t.taskId) || [];

    // 3. Get tasks that are NOT submitted
    const { data: unsubmitted, error } = await supabase
      .from('Tasks')
      .select('*')
      .not('id', 'in', `(${submittedIds.join(',') || 0})`)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    res.json(unsubmitted);
  } catch (err: any) {
    console.error("❌ Failed to fetch unsubmitted tasks:", err.message);
    res.status(500).json({ error: "Failed to fetch tasks", detail: err.message });
  }
});


export default router;
