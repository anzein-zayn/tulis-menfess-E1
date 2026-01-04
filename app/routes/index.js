const express = require('express');
const router = express.Router();
const db = require('../config/database');

/* =========================
   HALAMAN UTAMA (TIMELINE)
========================= */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        sender,
        content,
        color,
        likes,
        dislikes,
        created_at
      FROM menfess
      ORDER BY created_at DESC
    `);

    // Kirim ke index.ejs
    res.render('index', {
      messages: rows
    });

  } catch (err) {
    console.error('❌ Database error:', err);

    res.render('index', {
      messages: [],
      error: 'Database connection failed'
    });
  }
});

/* =========================
   HALAMAN CREATE MENFESS
========================= */
router.get('/create', (req, res) => {
  res.render('create');
});

/* =========================
   SUBMIT MENFESS
   (form action="/send")
========================= */
router.post('/send', async (req, res) => {
  const { sender, content, color } = req.body;

  // Validasi sederhana
  if (!sender || !content) {
    return res.redirect('/create');
  }

  try {
    await db.query(
      `INSERT INTO menfess (sender, content, color, likes, dislikes)
       VALUES (?, ?, ?, 0, 0)`,
      [
        sender.trim(),
        content.trim(),
        color || 'bg-white'
      ]
    );

    res.redirect('/');

  } catch (err) {
    console.error('❌ Insert error:', err);
    res.redirect('/create');
  }
});

/* =========================
   LIKE MENFESS
========================= */
router.post('/like/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'UPDATE menfess SET likes = likes + 1 WHERE id = ?',
      [id]
    );

    res.redirect('/');
  } catch (err) {
    console.error('❌ Like error:', err);
    res.status(500).send('Error updating like');
  }
});

/* =========================
   DISLIKE MENFESS
========================= */
router.post('/dislike/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      'UPDATE menfess SET dislikes = dislikes + 1 WHERE id = ?',
      [id]
    );

    res.redirect('/');
  } catch (err) {
    console.error('❌ Dislike error:', err);
    res.status(500).send('Error updating dislike');
  }
});

module.exports = router;
