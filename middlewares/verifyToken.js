const jwt = require('jsonwebtoken'); 
let dotenv = require("dotenv");
dotenv.config();

module.exports = {

    verifyToken : async(req, res, next ) =>{
    const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");
  

    if(!token) {
        return res.status(403).send("Kimlik doğrulaması için token gerekli");
    }
    try {
        const decoded  = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded; 
        console.log("decodedd ", decoded);
        next();


    }
  catch (err) {
    console.error("Token doğrulama hatası:", err.message); // Hata mesajını konsola yazdırın
    return res.status(401).send("Geçersiz token");
}

}}