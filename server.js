const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./server/routes/userRoutes');
const quizRouter = require('./server/routes/quizRoutes');
const courseRouter = require('./server/routes/courseRoutes');
const questionRouter = require('./server/routes/questionRoutes');
const discussionRouter = require ('./server/routes/discussionRoutes');
const fileRouter = require('./server/routes/fileRoutes');

dotenv.config();
// Middlewares
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Database Connection
const connectDb = async () => {
 mongoose.connect(process.env.MONGODB_CLOUD, 
      { useNewUrlParser: true,
        useUnifiedTopology: true
       })
    .then(() => {
      console.log(`Connection successful to ${mongoose.connection.host}`);
    })
    .catch(err => {
      console.error(`Error connecting to database: ${err.message}`);
    });
};
connectDb();

// Routes
app.use('/api/users', userRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/course', courseRouter);
app.use('/api/question', questionRouter);
app.use('/api/discussion',discussionRouter );
app.use('/api/uploads', fileRouter);



  // Server Connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
