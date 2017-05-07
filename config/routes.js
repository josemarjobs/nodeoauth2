var router = require('express').Router();
var authConfig = require('./auth-config');

router.get('/', (req, res)=>res.render('index'))

router.get('/login', (req, res)=>res.render('login'));
router.post('/login', authConfig.localLogin);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

router.get('/register', (req, res)=>res.render('register'))
router.post('/register', authConfig.localRegister);
router.get('/connect/local', (req, res)=>res.render('connect-local'))
router.post('/connect/local', authConfig.localConnect);

router.get('/facebook', authConfig.facebookLogin)
router.get('/facebook/callback', authConfig.facebookCallback)
router.get('/connect/facebook', authConfig.facebookConnect)
router.get('/connect/facebook/callback', authConfig.facebookConnectCallback)

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