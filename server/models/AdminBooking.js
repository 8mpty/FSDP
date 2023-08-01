module.exports = (sequelize, DataTypes) => {
    const AdminBooking = sequelize.define("AdminBooking", {
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
        
        
        imageFile: {
            type: DataTypes.STRING
        }
    });

    AdminBooking.associate = (models) => {
        AdminBooking.belongsTo(models.Admin, {
            foreignKey: "adminId",
            as: 'admin'
        });
    };

    return AdminBooking;
}
