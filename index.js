// routes/index.js
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM imagen', (err, results) => {
    if (err) throw err;
    res.render('index', { productos: results });
  });
});

router.post('/agregar-al-carrito/:id', (req, res) => {
  const productId = req.params.id;
  const sessionCart = req.session.cart || [];
  sessionCart.push(productId);
  req.session.cart = sessionCart;
  res.redirect('/');
});

router.get('/ver-carrito', (req, res) => {
  const sessionCart = req.session.cart || [];
  db.query('SELECT * FROM imagen WHERE imagen_id IN (?)', [sessionCart], (err, results) => {
    if (err) throw err;
    res.render('cart', { productos: results });
  });
});

router.get('/ver-orden/:numeroOrden', (req, res) => {
  const numeroOrden = req.params.numeroOrden;
  db.query('SELECT * FROM imagen WHERE orden = ?', [numeroOrden], (err, results) => {
    if (err) throw err;
    res.render('order', { productos: results });
  });
});

module.exports = router;
