const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['mcq', 't-f'], 
        required: true
    },
    question: {
        type: String,
    },
    options: [{
        type: String 
    }],
    correctAnswer: {
        type: String , 
        require: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
        
    },
    marks: {
      type: Number,
      required: true,
      default: 1 
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;