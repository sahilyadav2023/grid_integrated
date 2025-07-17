import express, { Request, Response } from 'express';
import supabase from '../supabaseClient';

const router = express.Router();

// GET: fetch next upcoming session
router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('upcoming_session')
    .select('*')
    .order('scheduled_at', { ascending: true })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.[0] || {});
});

// POST: create new upcoming session
router.post('/', async (req: Request, res: Response) => {
  const { title, speaker, scheduled_at } = req.body;

  const { data, error } = await supabase
    .from('upcoming_session')
    .insert([{ title, speaker, scheduled_at }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data?.[0]);
});

// PUT: update existing upcoming session
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { title, speaker, scheduled_at } = req.body;

  const { data, error } = await supabase
    .from('upcoming_session')
    .update({ title, speaker, scheduled_at })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.[0]);
});

export default router;
