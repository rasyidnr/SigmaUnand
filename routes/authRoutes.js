// D:\Pemograman\SigmaUnand\routes\authRoutes.js (VERSI BENAR)

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authcontroller');
const { isAuthenticated } = require('../middleware/auth');


router.get('/login', controller.showLogin);
router.post('/login', controller.login);
router.get('/register', controller.showRegister);
router.post('/register', controller.register);
router.get('/logout', controller.logout);

// Rute dashboard. Callback-nya selesai di sini.
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('auth/dashboard', { user: req.session.user });
});

// Rute untuk profil super admin. Didefinisikan secara terpisah.
router.get('/profil-super-admin', controller.showSuperAdminProfile);  

router.get('/manajemen-admin', controller.showManajemenAdmin);
router.get('/ukm-pendaftaran', controller.showUkmPendaftaran);
router.get('/masalah-ukm', controller.showMasalahUkm);
router.get('/faq', controller.showFaq);
router.get('/kerja-sama', controller.showKerjaSama);
router.get('/statistik-kegiatan', controller.showStatistikKegiatan);
router.get('/laporan-aktivitas', controller.showLaporanAktivitas);

// Rute untuk berita. Didefinisikan secara terpisah.
router.get('/berita', (req, res) => {
  const beritaList = Array.from({ length: 12 }, (_, i) => ({
    judul: `Judul Berita ${i + 1}`,
    isi: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
  }));

  res.render('berita', { beritaList });
});


module.exports = router;