module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Set the default value to false for regular users
        },
        verificationCode: { // Add this field to store the verification code
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Admin;
}