import { supabase } from '../supabase';

export const ShopItemModel = {
  async findAll() {
    const { data, error } = await supabase
      .from('ShopItems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('ShopItems')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async redeemItem(userId: string, itemId: string, coinCost: number) {
    // Step 1: Deduct coins
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({ coins: `coins - ${coinCost}` }) // Supabase supports this
      .eq('id', userId)
      .select()
      .single();

    if (profileError) throw profileError;

    // Step 2: Log the redemption (optional: if you have a redemptions table)
    await supabase.from('Redemptions').insert([
      { user_id: userId, item_id: itemId }
    ]);

    return profile;
  }
};
