
const PdfSchema = require("./../models/fileSchema");
const catchAsync = require("../utils/catchAsync");


exports.uploadSingleFile = catchAsync(async (req, res) => {
    const title = req.body.title;
    const fileName = req.file.filename;
      await PdfSchema.create({ title: title, pdf: fileName });
      res.send({ status: "ok" });
});
  
  
exports.getFiles = catchAsync(async (req, res) => {
      await PdfSchema.find().then((data) => {
              res.send({  documents: data });
      })
  });
  