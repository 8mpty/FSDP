module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    requestAsDriver:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    driverStatus:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
  User.associate = (models) => {
    User.hasMany(models.ridehistory, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  };
  return User;
};
