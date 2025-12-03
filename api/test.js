module.exports = async function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    env_check: {
      supabase_url: process.env.SUPABASE_URL ? 'Set ✓' : 'MISSING ✗',
      supabase_key: process.env.SUPABASE_ANON_KEY ? 'Set ✓' : 'MISSING ✗'
    }
  });
};