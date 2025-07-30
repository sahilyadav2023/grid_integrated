import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const { data, error } = await supabase
      .from('Redemptions')
      .select(`
        id,
        redeemed_at,
        ShopItems (
          name,
          cost
        )
      `)
      .eq('user_uid', uid)
      .order('redeemed_at', { ascending: false });

    if (error) throw error;

    const history = data.map((entry) => {
      const shopItem = Array.isArray(entry.ShopItems)
        ? entry.ShopItems[0]
        : entry.ShopItems;

      return {
        id: entry.id,
        name: shopItem?.name,
        cost: shopItem?.cost,
        redeemedAt: entry.redeemed_at,
      };
    });

    res.json(history);
  } catch (err: any) {
    console.error("❌ Failed to fetch redemptions:", err.message);
    res.status(500).json({ error: 'Failed to fetch reward history' });
  }
});

export default router;
