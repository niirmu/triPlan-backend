const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//we tell mongoose abput our model's properties using a Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, //an email is one of a kind inside the DB
    required: true //must fill in
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

//pre = a function that will run before we save a user into the db
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) { //if the user didnt change his password - dont try to salt
    return next();
  }

  //10 = the level of complexity of the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { //if there was an error during the generating of the salt
      return next(err);
    }
    //hash the user's password
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash; //update the user's password to be hashed
      next();
    });
  });
});

//attaching a method to our user model (via userSchema)
userSchema.methods.comparePassword = function(candidatePassword) { //candidatePassword = what the user is trying to login with
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => { //user.password = our salted & hashed password that is stored in mongoDB
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }
      resolve(true); //isMatch = true = the passwords match
    });
  });
};

module.exports = mongoose.model('User', userSchema);
