const {Sequelize, DataTypes} = require("sequelize");
const usersDb = new Sequelize('Users', 'postgres', 'qwert@123', {
    host: 'localhost',
    dialect: 'postgres',
  });

// const moviesDb = new Sequelize('Movies', 'postgres', 'qwert@123', {
//     host: 'localhost',
//     dialect: 'postgres',
//   });

  const User = require("../models/usersTable")(usersDb,DataTypes);
  const Otp = require("../models/otpTable")(usersDb,DataTypes);
  let db={};


  db.usersDb=usersDb;
  db.User=User;
  db.Otp=Otp;
  
  

  module.exports = db;

