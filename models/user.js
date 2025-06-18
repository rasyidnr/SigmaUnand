const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  nim: {
    type: DataTypes.STRING,
    unique: true
  },
  major: DataTypes.STRING,
  password_hash: DataTypes.TEXT,
  role: {
    type: DataTypes.ENUM('pengguna', 'admin_ukm', 'super_admin'),
    defaultValue: 'pengguna'
  }
});

module.exports = User;
