const bcrypt = require('bcryptjs');

module.exports = (usersDb, DataTypes) => {
  const User = usersDb.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "usertable",
    timestamps: false,
  });

  // Hook to hash password before creating a user
  // User.beforeCreate(async (user) => {
  //   if (user.password) {
  //     const salt = await bcrypt.genSalt(10);
  //     user.password = await bcrypt.hash(user.password, salt);
  //   }
  // });

  return User;
};

//   User.associate = models => {
//     User.hasMany(models.Task, { onDelete: 'CASCADE' });
//   };