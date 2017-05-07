var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var localRegisterInit = function(req, email, password, cb) {
  User.findOne({'local.email': email}).then(user => {
    if (user) {
      // TODO: supply a message
      return cb(null, false)
    }

    var newUser = new User();
    newUser.local.email = email;
    newUser.local.password = newUser.hashPassword(password);

    return newUser.save()
  }).then((user) => {
    cb(null, user);
  }).catch(cb)
}


var localLoginInit = function(req, email, password, cb) {
  User.findOne({'local.email': email}).then(user => {
    if (!user || !user.validatePassword(password)) {
      // TODO: supply a generi cmessage
      return cb(null, false)
    }
    return cb(null, user)
  }).catch(cb)
}
var localOptions = {
  usernameField: 'emailAddress',
  passReqToCallback: true,
};
passport.use('local-register', new LocalStrategy(localOptions, localRegisterInit))
passport.use('local-login', new LocalStrategy(localOptions, localLoginInit))

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

module.exports = {
  localRegister: passport.authenticate("local-register", {
    successRedirect: '/',
    failureRedirect: '/register'
  }),
  localLogin: passport.authenticate("local-login", {
    successRedirect: '/',
    failureRedirect: '/login'
  })
}