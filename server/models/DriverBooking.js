module.exports = (sequelize, DataTypes) => {
    const DriverBooking = sequelize.define("DriverBooking", {
        drivername: {
            type: DataTypes.STRING,
            allowNull: false
        },
        driverposition: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fare: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalearning: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination: {
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

    DriverBooking.associate = (models) => {
        DriverBooking.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return DriverBooking;
}
