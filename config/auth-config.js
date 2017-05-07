var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

var facebookConfig = {
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: "http://localhost:3000/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
};

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

var facebookInit = function(token, refreshToken, profile, cb) {
  User.findOne({"facebook.id": profile.id}).then(user => {
    if (user) {
      return cb(null, user);
    }  
    console.log("PROFILE: ", profile);

    var newUser = new User();
    newUser.facebook.id = profile.id;
    newUser.facebook.token = token;
    newUser.facebook.email = profile.emails[0].value;
    newUser.save(function(err) {
      if (err) {throw err;}
      return cb(null, newUser);
    });
  }).catch(cb)
}

passport.use(new FacebookStrategy(facebookConfig, facebookInit));
// passport.use('local-login', new LocalStrategy(localOptions, localLoginInit))


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
    successRedirect: '/profile',
    failureRedirect: '/register'
  }),
  localLogin: passport.authenticate("local-login", {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }),
  facebookLogin: passport.authenticate("facebook", {
    scope: "email"
  }),
  facebookCallback: passport.authenticate("facebook", {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
}