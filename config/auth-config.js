var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

var localRegisterInit = function(req, email, password, cb) {
  User.findOne({'local.email': email}, function(err, existingUser) {
    if(err) {return cb(err);}
    if (existingUser) {
      // TODO: supply a message
      return cb(null, false)
    }

    var user = (req.user) ? req.user : new User();
    user.local.email = email;
    user.local.password = user.hashPassword(password);

    return user.save(function(err) {
      if(err){throw err;}
      return cb(null, user)
    })
  });
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

var facebookConfig = {
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: "http://localhost:3000/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback: true
};

var facebookInit = function(req, token, refreshToken, profile, cb) {
  User.findOne({"facebook.id": profile.id}, function(err, existingUser) {
    if(err) {return cb(err)}
    if (existingUser) {return cb(null, existingUser);}
    
    var user = (req.user) ? req.user : new User();
    user.facebook.id = profile.id;
    user.facebook.token = token;
    user.facebook.email = profile.emails[0].value;
    user.save(function(err) {
      if (err) {throw err;}
      return cb(null, user);
    });
  });
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
  local: {
    register: passport.authenticate("local-register", {
      successRedirect: '/profile',
      failureRedirect: '/register'
    }),
    connect: passport.authenticate("local-register", {
      successRedirect: '/profile',
      failureRedirect: '/connect/local'
    }),
    login: passport.authenticate("local-login", {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }),
    disconnect: function(req, res, next) {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function(err) {
        if(err){console.log(err)}
        next();
      })
    }
  },
  facebook: {
    login: passport.authenticate("facebook", {scope: "email"}),
    callback: passport.authenticate("facebook", {
      successRedirect: '/profile',
      failureRedirect: '/'
    }),

    connect: passport.authorize("facebook", {scope: "email"}),
    connectCallback: passport.authorize("facebook", {
      successRedirect: '/profile',
      failureRedirect: '/profile'
    }),
    disconnect: function(req, res, next) {
      var user = req.user;
      user.facebook.token = undefined;
      user.facebook.id = undefined;
      user.facebook.email = undefined;
      user.save(function(err) {
        if(err){console.log(err)}
        next();
      })
    }
  }
}