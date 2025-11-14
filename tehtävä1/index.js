require('dotenv').config();
const path = require('path');
const express = require('express');
const { supabase } = require('./database.js');
const cors = require('cors');
const app = express();
app.use(express.json()); 
app.use(cors());

// GET quiz questions
app.get('/questions', async (request, response) => {
  const { data, error } = await supabase.from('questions').select('*');

  if (error) {
    console.error('Error fetching questions:', error);
    return response.status(500).json({ error: 'Database error' });
  }

  response.json(data);
});

// GET all users
app.get('/users', async (request, response) => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    console.error('Error fetching user:', error);
    return response.status(500).json({ error: 'Database error' });
  }

  response.json(data);
});

// GET question by id
app.get('/questions/:question_id', async (request, response) => {
  console.log('Route hit');
  const { id } = request.params; 
  console.log(id);

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('question_id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return response.status(404).json({ error: 'User not found' });
    }
    console.error('Error fetching user:', error);
    return response.status(500).json({ error: 'Database error' });
  }

  response.json(data);
});

// POST create user
app.post('/users', async (request, response) => {
  const body = request.body;

  const { data, error } = await supabase
    .from('users')
    .insert([{ username: body.username, highscore: body.highscore, topic: body.topic, time: body.time}])
    .select()
    .single();

if (error) {
  console.error('Supabase insert error:', error.message, error.details, error.hint);
  return response.status(500).json({ error: error.message, details: error.details });
}


  response.status(201).json(data);
});


// serve frontend build (ensure frontend is built to frontend/dist)
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});