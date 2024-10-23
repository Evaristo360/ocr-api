const UsersCallCenterService = require('../services/usersCallCenter.service');
const service = new UsersCallCenterService();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require('../config/config');


const secretKey = config.secretKeyAuth;

const register = async (req, res) => {
  try {
    if (!req.body) {
      console.error(new Date().toString(), " VALIDACIÓN: Debes indicar email y contraseña.");
      res.status(400).send({ success: false, message: "Debes indicar email y contraseña" });
      return;
    }

    const { name, lastname, email, password } = req.body;

    if (!(email && password)) {
      console.error(new Date().toString(), " VALIDACIÓN: Debes indicar email y contraseña.");
      res.status(400).send({ success: false, message: "Debes indicar email y contraseña" });
      return;
    }

    // Password regex validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{20,100}$/;
    if (!passwordRegex.test(password)) {
      console.error(new Date().toString(), " VALIDACIÓN: La contraseña debe tener entre 20 y 100 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito.");
      res.status(400).send({
        success: false,
        message:
          "La contraseña debe tener entre 20 y 100 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito.",
      });
      return;
    }

    const userExists = await service.findOneEmail(email);

    if (userExists) {
      console.error(new Date().toString(), " VALIDACIÓN: El email existe, por favor inicia sesión con tus credenciales.");
      res.status(400).send({ success: false, message: "El email existe, por favor inicia sesión con tus credenciales." });
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let newUser = {
      name,
      lastname,
      email,
      password: encryptedPassword,
      createdDate: new Date(),
      lastLogin: null
    }

    response = await service.create(newUser);


    res.status(200).send({ success: true, data: response });

  } catch (error) {
    console.error(new Date().toString(), " ERROR: ", error);
    res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      console.error(new Date().toString(), " VALIDACIÓN: Ingresa email y contraseña");
      res.status(400).send({ success: false, message: "Ingresa email y contraseña" });
    }

    let user = await service.findOneEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      let userEdit = user.dataValues;
      userEdit.lastLogin = new Date();
      await service.update(user.dataValues.id, userEdit);

      const token = jwt.sign({ email }, secretKey, { expiresIn: "18h" })
      user.dataValues.token = token;
      res.status(200).send({ success: true, data: user.dataValues });
    } else {
      console.error(new Date().toString(), " VALIDACIÓN: Credenciales inválidas");
      res.status(403).send({ success: false, message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error(new Date().toString(), " ERROR: ", error);
    res.status(500).send({ success: false, message: "Ha ocurrido un error en el servidor." });
  }
}

module.exports = {
  register,
  login
};
