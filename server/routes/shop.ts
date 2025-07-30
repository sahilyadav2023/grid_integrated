import express from 'express';
import { ShopItemModel } from '../models/ShopItem';
import { supabase } from '../supabase';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('📥 /shop GET called');

    const { data, error } = await supabase
      .from('ShopItems')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('✅ ShopItems data:', data);
    res.json(data);
  } catch (err: any) {
    console.error('🔥 /shop route failed:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch shop items', detail: err.message });
  }
});


router.post('/redeem', async (req, res) => {
  const { uid, itemId } = req.body;

  console.log("📥 Redeem request received");
  console.log("👉 uid:", uid);
  console.log("👉 itemId:", itemId);

  if (!uid || !itemId) {
    console.warn("⚠️ Missing uid or itemId");
    return res.status(400).json({ error: 'Missing uid or itemId' });
  }

  try {
    // 1. Fetch user
    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('uid, points')
      .eq('uid', uid)
      .single();
    
    if (userError || !user) {
      console.error("❌ User fetch failed:", userError?.message);
      throw userError || new Error("User not found");
    }

    console.log("✅ User found:", user);

    // 2. Fetch item
    const { data: item, error: itemError } = await supabase
      .from('ShopItems')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      console.error("❌ Item fetch failed:", itemError?.message);
      throw itemError || new Error("Item not found");
    }

    console.log("✅ Item found:", item);

    // 3. Check coin balance
    if ((user.points ?? 0) < item.cost) {
      console.warn("🚫 Not enough coins:", user.points);
      return res.status(400).json({ error: "Not enough coins" });
    }

    // 4. Log redemption
    console.log("📤 Logging redemption...");
    await supabase.from('Redemptions').insert([
      { user_uid: uid, item_id: itemId }
    ]);

    // 5. Deduct coins
    console.log("💸 Deducting coins...");
    await supabase
      .from('Users')
      .update({ points: (user.points ?? 0) - item.cost })
      .eq('uid', uid);

    console.log("🎉 Redemption complete");
    res.json({ message: 'Item redeemed successfully' });
  } catch (err: any) {
    console.error("🔥 Redeem failed:", err.message);
    res.status(500).json({ error: "Redeem failed", detail: err.message });
  }
});

// POST /shop/add - add new shop item
router.post('/add', async (req, res) => {
  const { name, description, cost, googleFormLink } = req.body;

  if (!name || !cost) {
    return res.status(400).json({ error: 'Missing name or cost' });
  }

  try {
    const { error } = await supabase.from('ShopItems').insert([
      {
        name,
        description,
        cost,
        googleFormLink,
      },
    ]);

    if (error) throw error;

    res.json({ message: 'Shop item added successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add item', detail: err.message });
  }
});

// PUT /shop/edit/:id - update existing item
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, cost, googleFormLink } = req.body;

  try {
    const { error } = await supabase
      .from('ShopItems')
      .update({ name, description, cost, googleFormLink })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Shop item updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update item', detail: err.message });
  }
});

// DELETE /shop/delete/:id - delete an item
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('ShopItems')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Shop item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete item', detail: err.message });
  }
});


export default router;
