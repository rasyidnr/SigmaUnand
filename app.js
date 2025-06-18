const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); 
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'sigma_unand_rahasia', resave: false, saveUninitialized: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.set('layout', 'layouts/layout');

const { isAuthenticated, isSuperAdmin, isAdminUKM, isPenggunaUmum } = require('./middleware/auth');

app.get('/superadmin', isAuthenticated, isSuperAdmin, (req, res) => {
  res.send('Panel Super Admin');
});

app.get('/adminukm', isAuthenticated, isAdminUKM, (req, res) => {
  res.send('Panel Admin UKM');
});

app.get('/pengguna', isAuthenticated, isPenggunaUmum, (req, res) => {
  res.send('Panel Pengguna Umum');
});

// app.js / server.js
const indexRouter = require('./routes/index');
// atau jika kamu pisahkan: const beritaRouter = require('./routes/berita');

app.use('/', indexRouter);
// app.use('/berita', beritaRouter); // kalau pakai file terpisah

const beritaList = [
  { id: 1, judul: "Berita UKM A", isi: "Isi lengkap berita UKM A..." },
  { id: 2, judul: "Event UKM B", isi: "Detail event UKM B yang akan datang..." },
  // dst...
];


// DB
const sequelize = require('./config/database');
sequelize.sync().then(() => app.listen(3000, () => console.log('Server running di http://localhost:3000')));
