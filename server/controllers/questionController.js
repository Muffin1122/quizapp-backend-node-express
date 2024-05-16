const Question = require('../models/questionSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createQuestions = catchAsync(async (req, res, next) => {
  try{
    const newQuestion = await Question.create(req.body);
    res.json({
      status: 'success',
      data: {
        quiz: newQuestion
      }
    });
    next();
  } catch (error) {
    next(error);
  }
  });

  exports.getAllQuestions = catchAsync(async (req, res, next) => {
    const question = await Question.find().select('-correctAnswer');
    if (!question) {
      return next(new AppError('No qestion found ', 404));
    }
    res.json({
      results: question.length,
      data: {
       question
      }
    })
  });
  