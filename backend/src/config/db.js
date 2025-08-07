const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

async function connectDB(uri = MONGO_URI) {
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri, { dbName: 'notesapp' });
  return mongoose.connection;
}

module.exports = { connectDB };
