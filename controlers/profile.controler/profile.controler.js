const USERMODEL = require("../../models/profile/user.model");
const { emailRegex, validatePassword } = require("../../utils/regex");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const checkInputs = (formData) => {
  let err = {};
  let formDataKeys = Object.keys(formData);

  if (!formDataKeys.length) {
    err.email = "Invalid Email Id";
    err.password = "Invalid Password!";
  }

  for (let index = 0; index < formDataKeys.length; index++) {
    const curentElem = formDataKeys[index];
    if (!formData[curentElem]) {
      err[curentElem] = `Please Fill ${curentElem}`;
    }
    switch (curentElem) {
      case "email":
        const checkEmail = emailRegex(formData?.email);
        if (!checkEmail) {
          err[curentElem] = "Please enter a valid email address.";
        }

        break;
      case "password":
        const checkPassword = validatePassword(formData?.password);
        if (!checkPassword) {
          err[curentElem] =
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
        }

        break;

      default:
        break;
    }
  }
  return err;
};
const createUser = async (req, res) => {
  try {
    console.log("enterrr ");
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please Provide All Required Fealds!", code: 400 });
    }
    // check error
    const formErr = checkInputs({
      email,
      password,
    });
    const checkErrLength = Object.keys(formErr).length;
    if (checkErrLength) {
      return res
        .status(200)
        .json({ msg: "bad gateWay", code: 400, err: formErr });
    }

    const checkUser = await USERMODEL.findOne({ email });

    if (checkUser) {
      return res
        .status(200)
        .json({ msg: "User Already Registered!", code: 400 });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const SECRET_KEY = process.env.SECRET_KEY;

    const createUser = await USERMODEL.create({
      email,
      password: hash,
      createdAt: new Date(),
    });
    const token = jwt.sign({ userId: createUser?._id }, SECRET_KEY, {
      expiresIn: "1m",
    });

    return res.status(200).json({
      msg: "User Created Success",
      code: 200,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};
const LoginControler = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please Provide All Required Fealds!", code: 400 });
    }
    const user = await USERMODEL.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ msg: "User Not Found! Please Register.", code: 400 });
    }

    const match = await bcrypt.compare(password, user?.password);
    if (!match) {
      return res.status(200).json({ msg: "Wrong Password!", code: 400 });
    }
    const newSecretKey = process.env.SECRET_KEY;

    const token = jwt.sign({ userId: user?._id }, newSecretKey, {
      expiresIn: "1m",
    });

    return res.status(200).json({
      msg: "Login Success!",
      code: 200,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal server error!", code: 500 });
  }
};
const logoutControler = async (req, res) => {
  try {
    const user = req.user;
    const deleteSecretKey = await USERMODEL.findByIdAndUpdate(
      { _id: user?._id },
      { user_secretkey: "" }
    );
    return res.status(200).json({ msg: "Log Out Success!", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};

const stsCheck = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      msg: "",
      code: 200,
      data: {
        sts: true,
      },
    });
  } catch (err) {
    return res.status(200).json({ msg: "Internal Server Error!", code: 500 });
  }
};

module.exports = { createUser, LoginControler, logoutControler, stsCheck };
