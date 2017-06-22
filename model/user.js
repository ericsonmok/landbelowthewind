import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
},{ timestamps: true});


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {

  console.log('pre save hook');
  const user = this;
  if (!user.isModified('password')) { return next(); }
  console.log('password is modified');
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    console.log('salt generated');
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      console.log('saving hash');
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
  });
};



const User = mongoose.model('User', userSchema);
module.exports = User;
