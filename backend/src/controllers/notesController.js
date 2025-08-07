const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');
const { getRedis } = require('../utils/redis');
const { invalidateUserNotesCache } = require('../utils/cache');

exports.createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }
  const note = await Note.create({ title, content, user: req.user.id });
  await invalidateUserNotesCache(req.user.id);
  res.status(201).json({ success: true, message: 'Note created', data: note });
});

exports.getNotes = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const redis = getRedis();
  const cacheKey = redis ? `notes:${req.user.id}:${page}:${limit}` : null;

  if (redis && cacheKey) {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const [total, notes] = await Promise.all([
    Note.countDocuments({ user: req.user.id }),
    Note.find({ user: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  const response = {
    success: true,
    message: 'Notes fetched',
    data: notes,
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 }
  };

  if (redis && cacheKey) {
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60); // cache 60s
  }

  res.json(response);
});

exports.getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json({ success: true, message: 'Note fetched', data: note });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { ...(title !== undefined && { title }), ...(content !== undefined && { content }) } },
    { new: true }
  );
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  await invalidateUserNotesCache(req.user.id);
  res.json({ success: true, message: 'Note updated', data: note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  await invalidateUserNotesCache(req.user.id);
  res.json({ success: true, message: 'Note deleted' });
});
