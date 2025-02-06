const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../models/User');

class Work extends Model {}

Work.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [60, 2000], 
                msg: "Description must be between 60 and 2000 characters long.",
            },
        },
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recommended: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
}, {
    sequelize,
    modelName: 'Work',
    tableName: 'works',
    timestamps: true, 
});

// Hook to enforce work creation limit and set recommended status
Work.beforeCreate(async (work) => {
    const user = await work.getUser();

    // Check user's premium status
    const maxWorks = user.isPremium ? 8 : 1; 
    const userWorksCount = await Work.count({
        where: { userId: user.id },
    });

    // Set the recommended field based on user's premium status
    if (user.isPremium) {
        work.recommended = true;
    }

    if (userWorksCount >= maxWorks) {
        throw new Error(`You can only create a maximum of ${maxWorks} works`);
    }
});

// Associations
User.hasMany(Work, { foreignKey: 'userId' });
Work.belongsTo(User, { foreignKey: 'userId' });

// Export the Work model
module.exports = Work;

