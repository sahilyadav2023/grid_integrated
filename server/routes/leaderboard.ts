import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('uid, email, name, points, tokens')
      .eq('admin', false)
      .order('points', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', detail: err.message });
  }
});

export default router;
