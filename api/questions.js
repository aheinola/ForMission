const { supabase } = require('../database.js');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Check if there's an ID in the URL
    const { question_id } = req.query;

    if (question_id) {
      // GET question by ID
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('question_id', question_id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Question not found' });
        }
        console.error('Error fetching question:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.json(data);
    } else {
      // GET all questions
      const { data, error } = await supabase.from('questions').select('*');

      if (error) {
        console.error('Error fetching questions:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.json(data);
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};