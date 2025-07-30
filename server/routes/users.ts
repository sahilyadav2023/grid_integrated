import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

// GET /users/:uid → fetch user data by Firebase UID
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const { data, error } = await supabase
      .from('Users')
      .select('id, uid, name, email, points, tokens')
      .eq('uid', uid)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error("❌ Error fetching user by UID:", err.message);
    res.status(500).json({ error: 'Failed to fetch user', detail: err.message });
  }
});

export default router;
