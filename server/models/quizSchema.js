const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  timelimit: Number,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
  },
  discussion: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
  }],
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  quizmaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalMarks: {
    type: Number,
    default: 0
  },

  attempts: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    obtainedMarks: Number ,
    badgeAssigned: String
}]
  
});

//  Document Middleware Pre-save hook to calculate total marks
quizSchema.pre('save', async function(next) {
  try {
    const totalMarks = await this.model('Question')
      .find({ _id: { $in: this.questions } })
      .select('marks')
      .then(questions => questions.reduce((total, question) => total + question.marks, 0));
    this.totalMarks = totalMarks;
    next();
  } catch (error) {
    next(error);
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;