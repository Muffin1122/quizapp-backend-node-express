const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Quiz = require('./../models/quizSchema');
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
    let doc = await User.findById(req.params.id);
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
            message: ' U R a teacher, u dont attemptts Quizs'
        });
    }
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

});
