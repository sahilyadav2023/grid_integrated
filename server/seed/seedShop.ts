import { supabase } from '../supabase';

async function seedShopItems() {
  const items = [
    {
      name: 'GRiD T-shirt',
      description: 'Premium cotton GRiD-branded T-shirt',
      cost: 100,
      googleFormLink: 'https://forms.gle/example1'
    },
    {
      name: '1-on-1 Mentor Call',
      description: 'Get personalized advice from an industry mentor',
      cost: 150,
      googleFormLink: 'https://forms.gle/example2'
    },
    {
      name: 'LinkedIn Profile Review',
      description: 'Let experts help improve your profile',
      cost: 50,
      googleFormLink: 'https://forms.gle/example3'
    }
  ];

  for (const item of items) {
    const { error } = await supabase.from('ShopItems').insert(item);
    if (error) {
      console.error(`Failed to insert item "${item.name}":`, error.message);
    } else {
      console.log(`Inserted: ${item.name}`);
    }
  }
}

seedShopItems();
