const Joi = require('joi');
module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define(
        "users",
        {
            userID : {
                type : Sequelize.UUID,
                defaultValue : Sequelize.UUIDV4,
                primaryKey : true,
            },

            firstName : {
                type : Sequelize.STRING,
                allowNull : true
            },
            lastName : {
                type : Sequelize.STRING,
                allowNull : true
            },
            birthYear : {
                type : Sequelize.STRING,
                allowNull : true
            },
            password : {
                type : Sequelize.STRING,
                allowNull : true

            },
            phoneNumber : {
                type : Sequelize.STRING,
                allowNull : false
            },
            email : {
                type : Sequelize.STRING,
                allowNull : true
            },
            
            address : {
            type: Sequelize.STRING,
            allowNull: true,
            },
            corporate : {
                type : Sequelize.BOOLEAN,
                allowNull : true
            },
            TCKN : {
                type : Sequelize.STRING,
                allowNull : true
            },

            country : {
                type : Sequelize.STRING,
                allowNull : true
            },
            city : {
                type : Sequelize.STRING,
                allowNull : true
            },

            district : {
                type : Sequelize.STRING,
                allowNull : true
             },

            companyName : {
                type : Sequelize.STRING,
                allowNull : true
            },

            taxNo : {
                type : Sequelize.STRING,
                allowNull : true
            },
            taxPlaceName : {
                type : Sequelize.STRING,
                allowNull : true
            },
            usercardName : {
                type : Sequelize.STRING,
                allowNull : true
            },
            creditCardName : {
                type : Sequelize.STRING,
                allowNull : true
            },
            cardNumber : {
                type : Sequelize.STRING,
                allowNull : true
            },
            expiryDateMonth: {
                type : Sequelize.STRING,
                allowNull : true
            },
            expiryDateYear : {
            type : Sequelize.STRING,
            allowNull : true
        },
            cvvCode : {
                type : Sequelize.STRING,
                allowNull : true
                
            }

           
        },
        {
            freezeTableName : true,
        }
    );
    return users;





}