const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const secretKey = config.secretKeyAuth;

const verifyToken = (req, res, next) => {
     
    let authorization = req.headers["authorization"];
    if (!authorization) {
        console.error(new Date().toString(), " VALIDACIÓN: No se ha enviado el token de autenticación.")
        return res.status(403).send({ success: false, message: "No se ha enviado el token de autenticación." });
    }

    const token = authorization.replace("Bearer ","");

    try{
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    }catch(err){
        console.error(new Date().toString(), " ERROR: ", err)
        return res.status(401).send({success:false, message:"Token inválido"});
    }
    return next();
}

module.exports = verifyToken;