// const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');
// const sequelize = require('../config/db');

// class User extends Model {}

// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true, // Ensure valid email format
//         },
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     isVerified: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false, // User is not verified by default
//     },
//     emailVerificationOtp: {
//         type: DataTypes.STRING,
//         allowNull: true, // OTP can be null until set
//     },
//     otpExpires: {
//         type: DataTypes.DATE,
//         allowNull: true, // Expiry can be null until set
//     },
//     resetPasswordOtp: {
//         type: DataTypes.STRING,
//         allowNull: true, // OTP can be null until set
//     },
//     resetPasswordExpires: {
//         type: DataTypes.DATE,
//         allowNull: true, // Expiry can be null until set
//     },
//     balance: {
//         type: DataTypes.INTEGER,
//         defaultValue: 10, // Set default points to 0
//     },
// }, {
//     sequelize,
//     modelName: 'User',
//     tableName: 'users', // Define the table name
//     timestamps: true, // Automatically add createdAt and updatedAt fields
// });

// // Hook to hash the password before saving the user
// User.beforeCreate(async (user) => {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
// });

// User.prototype.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // Export the User model
// module.exports = User;




const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensure valid email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // User is not verified by default
    },
    emailVerificationOtp: {
        type: DataTypes.STRING,
        allowNull: true, // OTP can be null until set
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true, // Expiry can be null until set
    },
    resetPasswordOtp: {
        type: DataTypes.STRING,
        allowNull: true, // OTP can be null until set
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true, // Expiry can be null until set
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 10, // Set default points to 10
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Set default points to 10
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Define the table name
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Hook to hash the password before saving the user
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = User;
