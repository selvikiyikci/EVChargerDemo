const bcrypt = require('bcrypt'); 
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const userService = require("../services/userService");
const { userModel } = require('../data/db.js');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require("../middlewares/verifyToken.js");
const  kontrol = require('istckimlik');
const validator = require('validator');
const { CHAR } = require('sequelize');
const MaskData = require('maskdata');
const crypto = require('crypto');
module.exports = {
     phoneNumberCheck: async (req, res) => {
      const { phoneNumber } = req.body;
       console.log("REQUEST!!", req);
            try {   
            await body('phoneNumber')
              .trim()
              .matches(/^(?:\+90|0)?5\d{9}$/).withMessage('Geçersiz Türkiye telefon numarası formatı')
              .run(req);
        
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              console.log(errors);
              return res.status(400).json({
                status: 'error',
                data : "Telefon numarası yanlış."
              });
            }
            const userid = await uuidv4();
            const newUser = await userService.findOrCreate(userModel, {where : {phoneNumber : phoneNumber}, defaults : {userID : userid, phoneNumber : phoneNumber } })

            const token = jwt.sign(
             { userid : newUser.data.userID },
             process.env.TOKEN_KEY
            );  
            res.status(200).json({
              status : "success",
              data : {token : token}
            });
    } catch (err) {
      console.error('Telefon numarası kontrol hatası:', err);
      return res.status(500).json({
        status: 'error',
        data: 'Internal server hatası',
      });
    }

  },
  passwordCheck: async (req, res) => {
    const { password } = req.body;
    const { userid } = req.user;
    console.log("NEW USER" , userid);
  
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 6;
  
    if (!hasUppercase || !hasNumber || !isValidLength) {
      return res.status(400).json({
        status: 'error',
        data: 'Password must be at least 6 characters long, contain at least one uppercase letter and one number',
      });
    }
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Şifreyi güncelle
      await userModel.update({ password: hashedPassword }, { where: { userID: userid } });
  
      // Kullanıcıyı kontrol et
      const user = await userService.findOne(userModel, { where: { userID: userid } });
  
      // Şifrenin doğru olduğunu doğrula
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        return res.status(200).json({
          status: 'success',
          data: 'Password updated successfully',
        });
      } else {
        return res.status(400).json({
          status: 'error',
          data: 'Passwords do not match',
        });
      }
    } catch (err) {
      console.error('Error processing request:', err);
      return res.status(500).json({
        status: 'error',
        data: 'Internal server error',
      });
    }
  },
  emailAndBirthYearCheck : async (req, res, next) => {
  const { firstName, lastName, email, birthYear } = req.body;
  const { userid } = req.user;

  // Email ve doğum yılı validasyonları
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Geçersiz email girişi' });
  }
  const yearRegex = /^(19|20)\d{2}$/;
  if (!birthYear || !yearRegex.test(birthYear)) {
    return res.status(400).json({ message: 'Geçersiz doğum yılı.' });
  }

  try {

    await userService.update(userModel,
      { firstName, lastName, email, birthYear },
      { where: { userID: userid } }
    );

    console.log(firstName, lastName, email, birthYear);

    res.status(200).json({
      status: 'success',
      message: 'Kullanıcı bilgileri başarıyla güncellendi',
    });

  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server hatası',
    });
  }
},
  TCKNcheck : async (req, res, next) => {
    const { TCKN, country, city, district, address } = req.body;
    const { userid } = req.user;
    try {

      if (!TCKN || !kontrol.isTCKimlik(TCKN)) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz TCKN.'
        });
      }

const encryptedTCKN = encryptTCKN(TCKN, 'secret key 123');
 
      await userService.update(userModel,
        { TCKN, country, city, district, address},
        { where: { userID: userid } }
      );
      
      res.status(200).json({
        status: 'success',
        message: 'TCKN geçerli ve güncellendi.'
      });
    } catch (error) {
      console.error('TCKN doğrulama hatası:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server hatası'
      });
    }
  },

  TaxNoCheck: async (req, res, next) => {
    const { companyName, taxNo, taxPlaceName, country, city, district, address } = req.body;
    const { userid } = req.user;
    let sum = 0;
    if (taxNo !== null && taxNo.length === 10 && !isNaN(taxNo)) {
      const lastDigit = parseInt(taxNo.charAt(9), 10);
      
      for (let i = 0; i < 9; i++) {
        const digit = parseInt(taxNo.charAt(i), 10);
        let temp = (digit + 10 - (i + 1)) % 10;
        sum += temp === 9 ? temp : (temp * Math.pow(2, 10 - (i + 1))) % 9;
      }

      if (lastDigit === (10 - (sum % 10)) % 10) {
        try {
          
          await userService.update(userModel, 
            { companyName, taxNo, taxPlaceName, country, city, district, address }, 
            { where: { userID: userid } }
          );
          
          return res.status(200).json({
            status: 'success',
            message: 'Vergi numarası geçerli ve güncellendi.',
          });
        } catch (error) {
          console.error('Vergi numarası güncelleme hatası:', error);
          return res.status(500).json({
            status: 'error',
            message: 'Internal server hatası.',
          });
        }
      }
    }
    
    return res.status(400).json({
      status: 'error',
      message: 'Geçersiz vergi numarası.',
    });
  },
    
    CardInfoCheck: async (req, res, next) => {
      const { usercardName, creditCardName, cardNumber, expiryDateMonth, expiryDateYear, cvvCode } = req.body;
      const { userid } = req.user;
    
      const validateCardNumber = (cardNumber) => {
        const cardNumberRegex = /^\d{16}$/;
        return cardNumberRegex.test(cardNumber);
      };
    
     
      const validateExpiryDate = (month, year) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expiryYear = parseInt(year, 10);
        const expiryMonth = parseInt(month, 10);
    
        if (expiryMonth < 1 || expiryMonth > 12) return false;
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) return false;
    
        return true;
      };
    
     
      const validateCVV = (cvvCode) => {
        const cvvRegex = /^\d{3}$/;
        return cvvRegex.test(String(cvvCode).trim());
      };
    
      if (!cardNumber || !validateCardNumber(cardNumber)) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz kart numarası.',
        });
      }
    
    
      if (!expiryDateMonth || !expiryDateYear || !validateExpiryDate(expiryDateMonth, expiryDateYear)) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz son kullanma tarihi.',
        });
      }
    
     
      if (!cvvCode || !validateCVV(cvvCode)) {
        return res.status(400).json({
          status: 'error',
          message: 'Geçersiz CVV kodu.',
        });
      }
    
      try {
       
        await userModel.update(
          { usercardName, creditCardName, cardNumber, expiryDateMonth, expiryDateYear, cvvCode },
          { where: { userID: userid } }
        );
    
        res.status(200).json({
          status: 'success',
          message: 'Kart bilgileri başarıyla güncellendi.',
        });
      } catch (error) {
        console.error('Kart bilgileri güncelleme hatası:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Internal server hatası.',
        });
      }
    },



      postLogin: async (req, res) => {
        const { email, password } = req.body;
    
        try {
          const user = await userService.findOne(userModel,{
            where: {  
              email: email
            }
          });
          console.log('User retrieved:', user);
          console.log('Password from request:', password);
    
          if (!user) {
            return res.status(400).json({
              status: 'error',
              message: 'Geçersiz email'
            });
          }
    
          const match = await bcrypt.compare(password, user.password);
    
          if (match) {
    
            return res.status(200).json({
              status: 'success',
              message: 'Login başarılı',
             
            });
          }
    
          return res.status(400).json({
            status: 'error',
            message: 'Geçersiz parola'
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
          });
        }
      },
      getUsersInfo: async (req, res) => {
        try {
          const { userid } = req.user;
          const user = await userModel.findOne({ where: { userID: userid } });
          
          if (!user) {
            return res.status(404).json({
              status: 'error',
              data: 'User not found',
            });
          }
          const role = user.corporate === 1 ? 'Kurumsal' : 'Bireysel';
          const maskNumberOptions = {
            maskWith: "*",
            unmaskedStartDigits: 4,
            unmaskedEndDigits: 1 
          };

          const maskedTckn = MaskData.maskCard(user.TCKN, maskNumberOptions);
            const getInitials = (firstName, lastName) => {
            const firstInit = firstName.charAt(0).toUpperCase();
            const lastInit= lastName.charAt(0).toUpperCase();
            return `${firstInit}${lastInit}`;
        };

        const maskedName = getInitials(user.firstName, user.lastName);

          res.status(200).json({
            status: "success",
            data: {
              id: user.userID,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber, 
              tckn: user.TCKN,
              role: role,
              address: user.address, 
              country: user.country,
              city: user.city,
              maskedTckn: maskedTckn,
              maskedName: maskedName
           
            
            },
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: "Error occurred" });
        }
      },
      
    
       deleteUserAccount: async (req, res) => {
        const { password } = req.body;
        try {
          const { userid } = req.user; 
          const user = await userModel.findOne({ where: { userID: userid } });
          
          if (!user) {
            return res.status(404).json({
              status: 'error',
              data: 'User not found',
            });
          }     
   
          const hashedPassword = user.password;
          const match = await bcrypt.compare(password, hashedPassword);
      
          if (match) {
            await userModel.destroy({ where: { userID: userid } });
      
            return res.status(200).json({
              status: 'success',
              data: 'User account deleted',
            });
          } else {
            return res.status(400).json({
              status: 'error',
              data: 'Passwords do not match',
            });
          }
        } catch (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({
            status: 'error',
            data: 'Internal server error',
          });
        }
      }
}
      