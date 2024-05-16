exports.topQuizResults = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-marks';
  req.query.fields = 'title';
  next();
};

router.get(/leaderdashboard, quizController.topQuizResults);