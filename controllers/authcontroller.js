const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.showLogin = (req, res) => {
  res.render('auth/login')
};

exports.showRegister = (req, res) => {
  res.render('auth/register')
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

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      where: { [require('sequelize').Op.or]: [{ email: identifier }, { nim: identifier }] }
    });
    if (!user) return res.send("User tidak ditemukan");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.send("Password salah");

    req.session.user = { id: user.id, role: user.role };
    res.redirect('/auth/dashboard');

  } catch (e) {
    res.send("Gagal login: " + e.message);
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};
