const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Quiz = require('./../models/quizSchema');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
  res.json({
    results: users.length,
    data: {
      users
    }
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => { 
    let doc =  await User.findById(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });


// progress tracking feature
exports.getProgressTracking = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const role = user.role;
if (role == 'teacher') {
  return res.json({
    message: 'Boom, U R a teacher'
  });
}
  try {
    const quizAttempts = await Quiz.find({ 'attempts.student': userId }).populate({
      path: 'attempts',
      populate: {
        path: 'student',
        select: 'name'
      }
    });

    let totalBadges = { Gold: 0, Silver: 0, Bronze: 0 };
    let totalMarks = 0;
    let totalAttempts = 0;

    quizAttempts.forEach(quiz => {
      quiz.attempts.forEach(attempt => {
        if (attempt.student._id.toString() === userId) {
          totalMarks += attempt.obtainedMarks;
          totalAttempts++;
          if (attempt.badgeAssigned === 'Gold') {
            totalBadges.Gold++;
          } else if (attempt.badgeAssigned === 'Silver') {
            totalBadges.Silver++;
          } else if (attempt.badgeAssigned === 'Bronze') {
            totalBadges.Bronze++;
          }
        }
      });
    });

    const avgMarks = totalAttempts > 0 ? totalMarks / totalAttempts : 0;

    res.status(200).json({
      userDetails: {
        user,
        totalBadges,
        avgMarks
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});


exports.forgotpassword = catchAsync(async (req, res) =>{
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your 
  new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget 
  your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
})