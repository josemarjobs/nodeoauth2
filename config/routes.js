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

module.exports = router;