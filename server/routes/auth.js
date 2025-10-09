const express = require('express');
const { supabase, hasRealCredentials } = require('../config/supabase');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Sign up with email and password
router.post('/signup', async (req, res) => {
  try {
    if (!hasRealCredentials) {
      return res.status(503).json({ 
        error: 'Supabase not configured. Please set up your Supabase project first.',
        setupRequired: true
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email for development
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = generateToken(data.user.id);

    res.json({
      user: data.user,
      token,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in with email and password
router.post('/signin', async (req, res) => {
  try {
    if (!hasRealCredentials) {
      return res.status(503).json({ 
        error: 'Supabase not configured. Please set up your Supabase project first.',
        setupRequired: true
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(data.user.id);

    res.json({
      user: data.user,
      token,
      message: 'Signed in successfully'
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in anonymously
router.post('/signin-anonymous', async (req, res) => {
  try {
    if (!hasRealCredentials) {
      return res.status(503).json({ 
        error: 'Supabase not configured. Please set up your Supabase project first.',
        setupRequired: true
      });
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = generateToken(data.user.id);

    res.json({
      user: data.user,
      token,
      message: 'Signed in anonymously'
    });
  } catch (error) {
    console.error('Anonymous signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
