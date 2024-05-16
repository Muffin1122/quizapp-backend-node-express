const Quiz = require('../models/quizSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createQuiz = catchAsync(async (req, res, next) => {
  const newQuiz = await Quiz.create(req.body);
  res.json({
    status: 'success',
    data: {
      quiz: newQuiz
    }
  });
});

exports.getQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id)
  .populate( { path: 'questions', 
  select: '-__v, -correctAnswer'})
  .populate({
    path: 'discussion',
    populate: {
      path: 'author', 
      select: 'name'
    }
  })
  if (!quiz) {
    return next(new AppError('No quiz found with that ID', 404));
  }
  res.json({
    data: {
      quiz
    }
  })
});

exports.getAllQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.find()
  .populate({
    path: 'questions',
    select: '-correctAnswer'
  });
  if (!quiz) {
    return next(new AppError('No quiz found ', 404));
  }
  res.json({
    results: quiz.length,
    data: {
      quiz
    }
  })
});


function calculatePercentage(obtainedMarks, totalMarks) {
  return (obtainedMarks / totalMarks) * 100;
}
exports.submitQuiz = catchAsync(async (req, res) => {
  const { studentId, answers } = req.body; 
  const { id: quizId } = req.params;
  const quiz = await Quiz.findById(quizId).populate('questions'); 
  if (!quiz) {
    return res.json({  message: 'Quiz not found' });
  }  
  let totalObtainedMarks = 0;  
  for (const question of quiz.questions) {
    const studentAnswer = answers.find(answer => answer.questionId === question._id.toString());    
    if (!studentAnswer) {
      return res.json({ 
       message: 'Answer not provided for all questions' });
    }   
    const isCorrect = studentAnswer.answer === question.correctAnswer;  
    totalObtainedMarks += isCorrect ? question.marks : 0;
  }  

  const percentage = calculatePercentage(totalObtainedMarks, quiz.totalMarks);
  let badge;
  if (percentage >= 95) {
    badge = 'Gold';
  } 
  else if (percentage >= 80) {
    badge = 'Silver';
  } 
  else if (percentage >= 70) {
    badge = 'Bronze';
  } 
  else {
    badge = 'Better luck next time';
  }
  quiz.attempts.push({
    student: studentId,
    obtainedMarks: totalObtainedMarks,
    badgeAssigned: badge 
  });
  // console.log( 'response', {
  //   data: {
  //     totalMarks: quiz.totalMarks,
  //     obtainedMarks: totalObtainedMarks,
  //     badgeAssigned: badge 
  //   }
  // }
  // );
  await quiz.save();
  
  res.status(200).json({
    data: {
      quiz,
      studentId,
      totalMarks: quiz.totalMarks,
      obtainedMarks: totalObtainedMarks,
      badgeAssigned: badge 
    }
  });
});

exports.getLeaderboard = catchAsync(async (req, res) => {
  const leaderboard = await Quiz.aggregate([
    { $unwind: '$attempts' },
    {
      $lookup: {
        // -> 'users' db
        from: 'users', 
        localField: 'attempts.student',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $group: {
        _id: '$attempts.student',
        totalMarks: { $max: '$attempts.obtainedMarks' },
        studentName:{ $first: { $arrayElemAt: ['$student.name', 0] } },
        totalMarks: { $max: '$attempts.obtainedMarks' },
        badgeAssigned: { $first: '$attempts.badgeAssigned' }
      }
    },
    { $sort: { totalMarks: -1 } },
    { $limit: 5 }
  ]);  
  res.json({  data: leaderboard });
});

exports.getAnalytics = catchAsync(async (req, res) =>{
  const analytics = await Quiz.aggregate([
    {
      $unwind: "$attempts" 
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" }, 
        averageScore: { $avg: "$attempts.obtainedMarks" }, 
        totalAttempts: { $sum: 1 } ,
        maxBadges: { $max: "$attempts.badgeAssigned" }
      }
    },
    {
      $project: {
        _id: 0, 
        title: 1,
        averageScore: { $round: ["$averageScore", 2] }, 
        totalAttempts: 1,
        maxBadges: 1
      }
    }
  ]);
  // console.log(analytics);
  res.json({  data: analytics });
});

