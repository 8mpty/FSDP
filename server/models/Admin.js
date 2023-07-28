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
    });
    return Admin;
}