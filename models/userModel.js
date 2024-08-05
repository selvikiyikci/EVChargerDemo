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
                allowNull : false
            },
            lastName : {
                type : Sequelize.STRING,
                allowNull : false
            },
            birthYear : {
                type : Sequelize.STRING,
                allowNull : false
            },
            password : {
                type : Sequelize.STRING,
                allowNull : false

            },
            phoneNumber : {
                type : Sequelize.STRING,
                allowNull : false
            },
            email : {
                type : Sequelize.STRING,
                unique : true,
                allowNull : false
            },
            address : {
                type : Sequelize.STRING,
                allowNull : false
            },
            corporate : {
                type : Sequelize.BOOLEAN,
                allowNull : false
            },
            TCKN : {
                type : Sequelize.STRING,
                allowNull : true
            },

            Country : {
                type : Sequelize.STRING,
                allowNull : false
            },
            City : {
                type : Sequelize.STRING,
                allowNull : false
            },

            District : {
                type : Sequelize.STRING,
                allowNull : true
             },

            companyName : {
                type : Sequelize.STRING,
                allowNull : false
            },

            taxNo : {
                type : Sequelize.STRING,
                allowNull : false
            },
            taxPlaceName : {
                type : Sequelize.STRING,
                allowNull : false
            },
            usercardName : {
                type : Sequelize.STRING,
                allowNull : false
            },
            creditCardName : {
                type : Sequelize.STRING,
                allowNull : false
            },
            cardNumber : {
                type : Sequelize.STRING,
                allowNull : false
            },
            expiryDateMonth: {
                type : Sequelize.STRING,
                allowNull : false
            },
            expiryDateYear : {
            type : Sequelize.STRING,
            allowNull : false
        },
            cvvCode : {
                type : Sequelize.STRING,
                allowNull : false
                
            }

           
        },
        {
            freezeTableName : true,
        }
    );
    return users;
}