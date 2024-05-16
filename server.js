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

// ----------------------------MULTER--------------

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./files");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// require("./server/models/fileSchema");
// const PdfSchema = mongoose.model("PdfDetails");

// const upload = multer({ storage: storage });
// app.post("/upload-files", upload.single("file"), async (req, res) => {
//   console.log(req.file);
//   const title = req.body.title;
//   const fileName = req.file.filename;
//   try {
//     await PdfSchema.create({ title: title, pdf: fileName });
//     res.send({ status: "ok" });
//   } catch (error) {
//     res.json({ status: error });
//   }
// });
// app.get("/get-files", async (req, res) => {
//   try {
//     PdfSchema.find().then((data) => {
//       res.send({  documents: data });
//     });
//   } catch (error) {}
// });




  // Server Connection
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
