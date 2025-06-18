const express = require('express');
const router = express.Router();

const beritaList = [
  { id: 1, judul: 'Kegiatan UKM 1', isi: 'Isi lengkap kegiatan UKM 1.' },
  { id: 2, judul: 'Workshop UKM 2', isi: 'Isi lengkap workshop UKM 2.' },
  { id: 3, judul: 'Pelatihan UKM 3', isi: 'Isi lengkap pelatihan UKM 3.' }
];

// Halaman list berita
router.get('/berita', (req, res) => {
  res.render('berita', { beritaList });
});

// Halaman detail berita
router.get('/berita/:id', (req, res) => {
  const berita = beritaList.find(b => b.id == req.params.id);
  if (!berita) return res.status(404).send("Berita tidak ditemukan");
  res.render('detailBerita', { berita });
});
router.get('/berita/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const berita = beritaList.find(b => b.id === id);
  
  if (!berita) {
    return res.status(404).send("Berita tidak ditemukan");
  }

  res.render('detailBerita', { berita });
});
router.get('/berita', (req, res) => {
  res.render('berita', { beritaList });
});

module.exports = router;
