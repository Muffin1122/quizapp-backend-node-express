const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: String
  }],
  quiz:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;