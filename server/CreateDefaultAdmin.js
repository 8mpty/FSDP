const { Admin } = require('./models');
const bcrypt = require('bcrypt');


// Function to generate a random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createDefaultAdmin() {
    try {
        console.log('Creating Default Admin, Please Wait.....');
        // Check if the default admin already exists in the database
        const defaultAdmins = await Admin.findOne({ where: { email: 'admin@admin.com' } });
        const admins = await Admin.findAll();
        const password = await bcrypt.hash('password123', 10);
        const code = generateVerificationCode();
        // If the default admin already exists, do nothing
        if (defaultAdmins) {
            console.log('Default admin already exists.');
            return;
        }

        if (admins.length === 0) {
            // If the default admin does not exist, create it
            const defaultAdminData = {
                name: 'Default Admin',
                email: 'admin@admin.com',
                password: password, // You should hash this password using bcrypt before saving it
                verificationCode: code,
            };
            // Create the default admin in the database
            const createdAdmin = await Admin.create(defaultAdminData);
            console.log('Default admin created:', createdAdmin.toJSON());
        }

    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}
module.exports = createDefaultAdmin;