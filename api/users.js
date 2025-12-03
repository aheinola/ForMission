const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // GET all users
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    return res.json(data);
  } 
  
  else if (req.method === 'POST') {
    // POST create user
    const body = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        username: body.username, 
        highscore: body.highscore, 
        topic: body.topic, 
        time: body.time
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message, error.details, error.hint);
      return res.status(500).json({ error: error.message, details: error.details });
    }

    return res.status(201).json(data);
  } 
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};