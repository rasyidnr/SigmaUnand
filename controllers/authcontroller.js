const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Op } = require('sequelize'); // Pastikan Op di-import dari sequelize

exports.showLogin = (req, res) => {
  res.render('auth/login');
};

exports.showRegister = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  const { first_name, last_name, email, nim, major, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.send("Email sudah terdaftar.");

    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, nim, major, password_hash: hash });
    res.redirect('/auth/login');
  } catch (e) {
    res.send("Gagal register: " + e.message);
  }
};

// --- FUNGSI LOGIN YANG DIMODIFIKASI ---
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  // --- AWAL PERUBAHAN: Logika Khusus Super Admin ---
  const superAdminEmail = 'superadmin@gmail.com';
  const superAdminPassword = 'superadmin123';

  if (identifier === superAdminEmail && password === superAdminPassword) {
    console.log('Login sebagai Super Admin terdeteksi.');
    // DIUBAH: Ganti username dan hapus email karena tidak diperlukan lagi
    req.session.user = {
      username: 'Super Admin', 
      role: 'superadmin' 
    };
    // Simpan session lalu redirect untuk menghindari race condition
    return req.session.save(err => {
      if (err) {
        return res.send("Gagal membuat session: " + err.message);
      }
      return res.redirect('/auth/profil-super-admin');
    });
  }
  // --- AKHIR PERUBAHAN ---


  // Jika bukan super admin, lanjutkan ke logika login untuk pengguna biasa
  try {
    const user = await User.findOne({
      // Menggunakan Op dari sequelize
      where: { [Op.or]: [{ email: identifier }, { nim: identifier }] }
    });

    if (!user) return res.send("User tidak ditemukan");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.send("Password salah");

    // Buat session untuk pengguna biasa
    req.session.user = { 
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        role: user.role // Asumsikan ada kolom 'role' di tabel User Anda
    };

    // Simpan session lalu redirect
    return req.session.save(err => {
        if(err) {
            return res.send("Gagal membuat session: " + err.message);
        }
        return res.redirect('/auth/dashboard'); // Redirect ke dashboard pengguna biasa
    });

  } catch (e) {
    res.send("Gagal login: " + e.message);
  }
};

exports.logout = (req, res) => {
  // Gunakan callback untuk memastikan session hancur sebelum redirect
  req.session.destroy((err) => {
    if (err) {
        return res.send("Gagal logout.");
    }
    res.clearCookie('connect.sid'); // Hapus cookie session
    res.redirect('/auth/login');
  });
};

// --- FUNGSI BARU UNTUK MENAMPILKAN HALAMAN ADMIN ---
exports.showSuperAdminProfile = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('profil-super-admin', { 
        layout: 'layouts/app-layout', 
        admin: req.session.user 
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showLaporanAktivitas = (req, res) => {
  // Pengaman: Pastikan hanya admin yang bisa akses
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('laporan-aktivitas', {
      layout: 'layouts/app-layout', // Gunakan layout aplikasi kita
      user: req.session.user // Kirim data user jika perlu
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showStatistikKegiatan = (req, res) => {
  // Pengaman: Pastikan hanya admin yang bisa akses
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('statistik-kegiatan', {
      layout: 'layouts/app-layout', // Gunakan layout aplikasi utama
      user: req.session.user
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showKerjaSama = (req, res) => {
  // Pengaman: Pastikan hanya admin yang bisa akses
  if (req.session.user && req.session.user.role === 'superadmin') {
    
    // Nanti, data ini akan diambil dari database.
    // Untuk sekarang, kita gunakan data dummy agar tabel bisa terbentuk.
    const dummyKerjasama = [
      { no: 1, nama: '', tanggal: '', ukm: '', tentang: '', status: '' },
      { no: 2, nama: '', tanggal: '', ukm: '', tentang: '', status: '' },
      { no: 3, nama: '', tanggal: '', ukm: '', tentang: '', status: '' },
      { no: 4, nama: '', tanggal: '', ukm: '', tentang: '', status: '' },
    ];

    res.render('kerja-sama', {
      layout: 'layouts/app-layout',
      user: req.session.user,
      kerjasamaList: dummyKerjasama // Kirim data ke view
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showManajemenAdmin = (req, res) => {
  // Pengaman: Pastikan hanya admin yang bisa akses
  if (req.session.user && req.session.user.role === 'superadmin') {

    // Nanti, data ini akan diambil dari database pengguna yang memiliki role 'admin'
    const dummyAdmins = [
      { id: 1, nama: 'Admin 1' },
      { id: 2, nama: 'Admin 2' },
      { id: 3, nama: 'Admin 3' },
    ];

    res.render('manajemen-admin', {
      layout: 'layouts/app-layout',
      user: req.session.user,
      adminList: dummyAdmins // Kirim data admin ke view
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showUkmPendaftaran = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    
    // Data dummy untuk list pendaftar. Nantinya diambil dari database.
    const dummyPendaftar = [
      { id: 1, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 2, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 3, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 4, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
      { id: 5, nama: '', tanggal: '', ukm: '', divisi: '', berkas: '', status: '' },
    ];

    res.render('ukm-pendaftaran', {
      layout: 'layouts/app-layout',
      user: req.session.user,
      pendaftarList: dummyPendaftar
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showMasalahUkm = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    res.render('masalah-ukm', {
      layout: 'layouts/app-layout',
      user: req.session.user
    });
  } else {
    res.redirect('/auth/login');
  }
};

exports.showFaq = (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {

    const dummyFaq = [
      {
        question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        answer: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      {
        question: 'Duis aute irure dolor in reprehenderit in voluptate velit esse?',
        answer: 'Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        question: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet?',
        answer: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
      },
    ];

    res.render('faq', {
      layout: 'layouts/app-layout',
      user: req.session.user,
      faqList: dummyFaq
    });
  } else {
    res.redirect('/auth/login');
  }
};