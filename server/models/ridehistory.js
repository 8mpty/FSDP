module.exports = (sequelize, DataTypes) => {
  const ridehistory = sequelize.define("ridehistory", {
    driver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    end: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    role: {
      type: DataTypes.ENUM("driver", "rider"),
      allowNull: false
    }
  });
  ridehistory.associate = (models) => {
    ridehistory.belongsTo(models.User, {
      foreignKey: "userId",
      as: 'user'
    });
  };
  return ridehistory;

};
