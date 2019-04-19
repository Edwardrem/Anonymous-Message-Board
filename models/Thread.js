const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  text: { type: String },
  created_on: { type: Date, default: new Date() },
  delete_password: { type: String },
  reported: { type: Boolean, default: false }
}, { _id: true });

const ThreadSchema = new Schema({
  board: { type: String },
  text: { type: String },
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  reported: { type: Boolean, default: false },
  delete_password: { type: String },
  replies: { type: Array, value: ReplySchema }
}, { versionKey: false });

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports.Thread = Thread;

