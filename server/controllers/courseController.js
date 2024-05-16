const Course = require('../models/courseSchema');
const catchAsync = require('../utils/catchAsync');

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create(req.body);
  res.json({
    status: 'success',
    data: {
      quiz: newCourse
    }
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError('No quiz found with that ID', 404));
  }
  res.json({
    data: {
      course
    }
  })
});
