const crypto =require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
name:{
    type: String,
    require: true
},
role: {
    type: String,
    enum: ['student', 'teacher' , 'admin'],
    default: 'student'
},
email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
},
password : {
    type: String,
    require: true,
    minlength: 8,
    select: false
}
,passwordChangedAt: Date,
passwordResetToken: String,
passwordResetExpires: Date

});
// making passwords hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) 
    return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// comparing if passwords are correct to login
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;