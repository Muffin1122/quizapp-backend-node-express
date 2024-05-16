const Discussion = require('../models/discussionSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createDiscussion = catchAsync(async (req, res, next) => {
  const newDiscussion = await Discussion.create(req.body);
  res.json({
    status: 'success',
    data: {
      forum : newDiscussion
    }
  });
});

exports.getAllDiscussions = catchAsync(async (req, res, next) => {
  const discussion = await Discussion.find();
  if (!discussion) {
    return next(new AppError('No discussion found ', 404));
  }
  res.json({
    data: {
      discussion
    }
  })
});