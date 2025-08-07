const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB(uri = MONGO_URI) {
  if (uri === 'memory') {
    const mongo = await MongoMemoryServer.create();
    const memUri = mongo.getUri();
    await mongoose.connect(memUri, { dbName: 'notesapp' });
    return mongoose.connection;
  }
  if (!uri) throw new Error('MONGO_URI not set');
  await mongoose.connect(uri, { dbName: 'notesapp' });
  return mongoose.connection;
}

module.exports = { connectDB };
