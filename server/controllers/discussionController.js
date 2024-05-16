const Discussion = require('../models/discussionSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Quiz = require('../models/quizSchema');

exports.createDiscussion = catchAsync(async (req, res, next) => {
  const newDiscussion = await Discussion.create(req.body);
  const discussionId = newDiscussion._id;
  const quizId = req.body.quiz; 
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return next(new AppError('Quiz not found', 404));
  }
  quiz.discussion.push(discussionId);
  await quiz.save();
  res.json({
    status: 'success',
    data: {
      forum: newDiscussion
    }
  });
});

exports.getAllDiscussions = catchAsync(async (req, res, next) => {
  const discussions = await Discussion.aggregate([
    {
      $lookup: {
        from: 'users', 
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: '$author'
    },
    {
      $lookup: {
        from: 'quizzes', 
        localField: 'quiz',
        foreignField: '_id',
        as: 'quiz'
      }
    },
    {
      $unwind: '$quiz'
    },
    {
      $project: {
        _id: 0,
        comments: 1,
        author: '$author.name', 
        quizTitle: '$quiz.title',
        createdAt: 1,
      }
    }
  ]);
  
  if (!discussions || discussions.length === 0) {
    return next(new AppError('No discussions found', 404));
  }

  res.json({
    data: {
      discussion: discussions
    }
  });
});
