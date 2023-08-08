module.exports = (sequelize, DataTypes) => {
  const ridehistory = sequelize.define("ridehistory", {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    points: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },

  });
  ridehistory.associate = (models) => {
    ridehistory.belongsTo(models.User, {
      foreignKey: "userId",
      as: 'user'
    });
  };

  ridehistory.associate = (models) => {
    ridehistory.belongsTo(models.Booking, {
      foreignKey: "bookingId",
      as: 'booking'
    });
  };

  ridehistory.associate = (models) => {
    ridehistory.belongsTo(models.DriverBooking, {
      foreignKey: "driverbookingId",
      as: 'driverbooking'
    });
  };

  return ridehistory;

};
