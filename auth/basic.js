var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var authenticate = function(username, password, cb) {
  if(username === 'peter' && password === 'bar') {
    return cb(null, {
      username,
      displayName: 'Peter Griffin'
    })
  } else {
    return cb(null, false)
  }
}

passport.use(new BasicStrategy(authenticate))
exports.isAuthenticated = passport.authenticate("basic", {session: false})