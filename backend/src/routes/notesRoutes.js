const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../controllers/notesController');

/**
 * @openapi
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: Get notes with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', protect, getNotes);

/**
 * @openapi
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create note
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', protect, createNote);

router.get('/:id', protect, getNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
