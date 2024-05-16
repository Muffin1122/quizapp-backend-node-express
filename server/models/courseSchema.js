const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['english', 'computer']
  },
  quizes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
 file: {
  type: String
 }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;