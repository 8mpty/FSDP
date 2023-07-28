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
      defaultValue: false, // Set the default value to false for regular users
    },
    
  });
  User.associate = (models) => {
    User.hasMany(models.ridehistory, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  };
  return User;
};
