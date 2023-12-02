const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'mysecretkey', resave: true, saveUninitialized: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos exitosa');
});

// Middleware para verificar sesión
const checkSession = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        res.send('Debes iniciar sesión para acceder a esta página. <a href="/login">Iniciar Sesión</a>');
    }
};

app.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.render('index', { productos: results, loggedin: req.session.loggedin });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admin_users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/admin/productos');
        } else {
            res.send('Credenciales incorrectas. <a href="/login">Volver al inicio de sesión</a>');
        }
    });
});

app.get('/productos', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.render('productos', { productos: results });
    });
});

app.get('/admin/productos', checkSession, (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.render('admin-productos', { productos: results });
    });
});

// Ruta para procesar la actualización de producto
app.post('/admin/productos/:id/edit', (req, res) => {
    const productId = req.params.id;
    const { productname, costprice, sellprice, brand } = req.body;
    db.query('UPDATE products SET productname = ?, costprice = ?, sellprice = ?, brand = ? WHERE id = ?',
        [productname, costprice, sellprice, brand, productId],
        (err) => {
            if (err) throw err;
            res.redirect('/admin/productos');
        });
});

// Ruta para procesar la eliminación de producto
app.post('/admin/productos/:id/delete', (req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
        if (err) throw err;
        res.redirect('/admin/productos');
    });
});

// Ruta para procesar la adición de producto
app.post('/admin/productos/add', (req, res) => {
    const { productname, costprice, sellprice, brand } = req.body;
    db.query('INSERT INTO products (productname, costprice, sellprice, brand) VALUES (?, ?, ?, ?)',
        [productname, costprice, sellprice, brand],
        (err) => {
            if (err) throw err;
            res.redirect('/admin/productos');
        });
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
