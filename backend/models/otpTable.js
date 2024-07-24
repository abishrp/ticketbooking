

// OTP model
module.exports = (usersDb, DataTypes) => {
  const Otp = usersDb.define('Otp', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otptable",
    timestamps: false,
  });

  return Otp;
};
