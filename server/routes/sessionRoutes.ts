import express, { Request, Response } from 'express';
import supabase from '../supabaseClient';

const router = express.Router();

// GET: latest session
router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('live_session')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.[0] || {});
});

// POST: start new session
router.post('/start', async (req: Request, res: Response) => {
  const { title, video_url } = req.body; // ✅ FIXED: use correct field name

  console.log("Creating session with:", { title, video_url });

  // Optional: mark all others as not live
  await supabase
    .from('live_session')
    .update({ is_live: false })
    .eq('is_live', true);

  const { data, error } = await supabase
    .from('live_session')
    .insert([
      {
        title,
        video_url,
        is_live: true,
        started_at: new Date(),
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data?.[0]);
});

// GET: currently live session
router.get('/live', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('live_session')
    .select('*')
    .eq('is_live', true)
    .order('started_at', { ascending: false })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.[0] || {});
});

export default router;
