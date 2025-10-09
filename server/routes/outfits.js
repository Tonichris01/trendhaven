const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');
const openai = require('../config/openai');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Analyze outfit with AI
async function analyzeOutfit(imagePath) {
  try {
    // Convert image to base64 for OpenAI
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg'; // Assuming JPEG for now

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this outfit photo as a professional fashion consultant. Rate the outfit on a scale of 1-10 and provide detailed feedback on:
                1. Overall style score (1-10)
                2. Color coordination (1-10) 
                3. Trend alignment (1-10)
                4. Category (casual, formal, street, party, business, athletic)
                5. Style tags (max 5 tags like "minimalist", "bohemian", "edgy", etc.)
                6. Constructive feedback (2-3 sentences)
                
                Respond in JSON format:
                {
                  "overallRating": number,
                  "styleScore": number,
                  "colorCoordination": number,
                  "trendAlignment": number,
                  "category": string,
                  "tags": string[],
                  "feedback": string
                }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const analysisText = response.choices[0].message.content;
    if (!analysisText) {
      throw new Error("No analysis received from AI");
    }

    // Parse AI response - handle potential markdown formatting
    const cleanText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleanText);

    return analysis;
  } catch (error) {
    console.error("AI analysis failed:", error);
    throw new Error("Failed to analyze outfit. Please try again.");
  }
}

// Upload and analyze outfit
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { mood, occasion, season } = req.body;
    const imagePath = req.file.path;

    // Analyze the outfit with AI
    const analysis = await analyzeOutfit(imagePath);

    // Upload image to Supabase Storage (you'll need to set this up)
    // For now, we'll store the local path
    const imageUrl = `/uploads/${req.file.filename}`;

    // Save outfit to database
    const { data, error } = await supabase
      .from('outfits')
      .insert({
        user_id: req.user.id,
        image_url: imageUrl,
        category: analysis.category,
        rating: analysis.overallRating,
        style_analysis: {
          styleScore: analysis.styleScore,
          colorCoordination: analysis.colorCoordination,
          trendAlignment: analysis.trendAlignment,
          feedback: analysis.feedback,
          tags: analysis.tags
        },
        mood: mood || null,
        occasion: occasion || null,
        season: season || null,
        favorite: false
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      fs.unlinkSync(imagePath);
      return res.status(500).json({ error: `Failed to save outfit: ${error.message}` });
    }

    res.json({
      outfit: data,
      analysis,
      message: 'Outfit analyzed and saved successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Get user's outfits
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('outfits')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ outfits: data || [] });
  } catch (error) {
    console.error('Get outfits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get outfit recommendations
router.post('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { mood, occasion, weather } = req.body;

    // Get user's outfits
    const { data: outfits, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!outfits || outfits.length === 0) {
      return res.json({ recommendations: [] });
    }

    // Use AI to recommend outfits
    const prompt = `Based on the following context, recommend the best 3 outfits from the user's wardrobe:
    
    Context:
    - Mood: ${mood || "any"}
    - Occasion: ${occasion || "any"}
    - Weather: ${weather || "any"}
    
    Available outfits:
    ${outfits.map((outfit, index) => 
      `${index + 1}. Category: ${outfit.category}, Rating: ${outfit.rating}/10, Tags: ${outfit.style_analysis.tags.join(", ")}`
    ).join("\n")}
    
    Respond with just the outfit numbers (1-${outfits.length}) in order of recommendation, separated by commas.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50
      });

      const recommendationText = response.choices[0].message.content?.trim();
      if (!recommendationText) {
        return res.json({ recommendations: outfits.slice(0, 3) });
      }

      const indices = recommendationText.split(",").map((n) => parseInt(n.trim()) - 1);
      const recommendations = indices
        .filter((i) => i >= 0 && i < outfits.length)
        .map((i) => outfits[i])
        .slice(0, 3);

      res.json({ recommendations });
    } catch (error) {
      console.error("Recommendation failed:", error);
      // Fallback: return highest rated outfits
      const recommendations = outfits
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      res.json({ recommendations });
    }
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle favorite status
router.patch('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get current outfit
    const { data: outfit, error: fetchError } = await supabase
      .from('outfits')
      .select('favorite')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !outfit) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    // Toggle favorite status
    const { data, error } = await supabase
      .from('outfits')
      .update({ favorite: !outfit.favorite })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ outfit: data });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete outfit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get outfit to find image path
    const { data: outfit, error: fetchError } = await supabase
      .from('outfits')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !outfit) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    // Delete from database
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Delete image file
    if (outfit.image_url && outfit.image_url.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', '..', outfit.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Outfit deleted successfully' });
  } catch (error) {
    console.error('Delete outfit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
