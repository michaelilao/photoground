const router = require('express').Router();
const { authenticateWeb } = require('../middleware/auth');
const { getPhotoList } = require('../photos/services');
// Web Routes
router.get('/', async (req, res) => {
  const user = authenticateWeb(req);
  if (!user) {
    return res.render('pages/root');
  }

  const photos = await getPhotoList(user.id, 20, 0);
  return res.render('pages/home', { user, photos });
});

router.get('/login', (req, res) => {
  const user = authenticateWeb(req);
  if (!user) {
    return res.render('pages/login');
  }
  return res.redirect('/');
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/');
});

module.exports = router;
