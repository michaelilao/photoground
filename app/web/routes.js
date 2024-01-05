const router = require('express').Router();
const { authenticateWeb } = require('../middleware/auth');
const { getPhotoList } = require('../photos/services');

// Web Routes
const generateHref = (col, currentOrder, currentSort) => {
  let sort;
  if (col.id !== currentOrder) {
    sort = 'desc';
  } else if (col.id === currentOrder && currentSort === 'desc') {
    sort = 'asc';
  } else {
    sort = 'desc';
  }

  const href = `?order=${col.id}&sort=${sort}`;
  return href;
};

router.get('/', async (req, res) => {
  const user = authenticateWeb(req);
  if (!user) {
    return res.render('pages/root');
  }
  const order = req.query.order || 'dateOriginal';
  const sort = req.query.sort || 'asc';
  let columns = [
    {
      id: 'dateOriginal',
      display: 'date',
    },
    {
      id: 'hex',
      display: 'color',
    },
    {
      id: 'name',
      display: 'name',
    },
  ];

  const iconLink = sort === 'asc' ? 'icons/chevron-down.svg' : 'icons/chevron-up.svg';
  columns = columns.map((col) => ({
    ...col,
    href: generateHref(col, order, sort),
  }));
  let photos = await getPhotoList(user.userId, 100, 0, sort, order);

  // Better way to handle this
  if (photos.error) {
    photos = [];
  }
  return res.render('pages/home', { user, photos, order, sort, columns, iconLink });
});

router.get('/login', (req, res) => {
  const user = authenticateWeb(req);
  if (!user) {
    return res.render('pages/login');
  }
  return res.redirect('/');
});

router.get('/upload', (req, res) => {
  const user = authenticateWeb(req);
  if (!user) {
    return res.redirect('/login');
  }

  return res.render('pages/upload', { user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/');
});

module.exports = router;
