var router = require('express').Router();
var authConfig = require('./auth-config');

router.get('/', (req, res)=>res.render('index'))

router.get('/login', (req, res)=>res.render('login'));
router.post('/login', authConfig.local.login);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

router.get('/register', (req, res)=>res.render('register'))
router.post('/register', authConfig.local.register);
router.get('/connect/local', (req, res)=>res.render('connect-local'))
router.post('/connect/local', authConfig.local.connect);
router.get('/disconnect/local', authConfig.local.disconnect, (req, res) => {
  res.redirect('/profile')
})

router.get('/facebook', authConfig.facebook.login)
router.get('/facebook/callback', authConfig.facebook.callback)
router.get('/connect/facebook', authConfig.facebook.connect)
router.get('/connect/facebook/callback', authConfig.facebook.connectCallback)
router.get('/disconnect/facebook', authConfig.facebook.disconnect, (req, res) => {
  res.redirect('/profile');
})

router.get('/demo', authConfig.demo.login)
router.get('/demo/callback', authConfig.demo.callback)

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render("profile", {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  } 
  res.redirect('/login')
}
module.exports = router;