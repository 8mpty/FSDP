module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pickup: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        passby: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: false
        },


        imageFile: {
            type: DataTypes.STRING
        }
    });

    
    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });

        Booking.belongsTo(models.DriverBooking, {
            foreignKey: "driverbookingId",
            as: 'driverbooking'
        });
    };

    



    return Booking;
}
