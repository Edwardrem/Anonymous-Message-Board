const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  text: { type: String },
  created_on: { type: Date },
  delete_password: { type: String },
  reported: { type: Boolean, default: false }
}, { _id: true });

const ThreadSchema = new Schema()

/*

Example Schema:

const UserSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  count: { type: Number },
  log: { type: Array, value: ExerciseSchema }
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);

module.exports.User = User;


thread document will contain: 
  {
    _id: // native subdoc _id can be used,
    text: { type: String },
    created_on(date&time): { type: Date },
    bumped_on(date&time initializes to equal created_on: { type: Date },
    reported: { type: Boolean },
    delete_password: { type: String },
    replies: { type: Array } 
  }

*/

