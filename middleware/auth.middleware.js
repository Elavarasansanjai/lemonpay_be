const jwt = require("jsonwebtoken");
const USERMODEL = require("../models/profile/user.model");
// Function to get user by refresh token
async function getUserByRefreshToken(userId) {
  try {
    console.log("alksd caaaaaaaaa");
    const result = await USERMODEL.findOne({ _id: userId });
    console.log("after..........", result);

    if (result) {
      console.log("enter refresh function user.....", result);
      const userData = result; // Return user record

      const createNewAccessToken = jwt.sign(
        { userId: userData._id },
        userData?.user_secretkey,
        { expiresIn: "1m" }
      );
      console.log("new access token,,,,,,,,,,,", createNewAccessToken);

      return { accessToken: createNewAccessToken, sts: true };
    } else {
      return { sts: false, msg: "User Not Found" };
    }
  } catch (err) {
    console.error("Error fetching user", err.stack);
    if (err.name === "TokenExpiredError") {
      console.log("/enterrrrrr");
      return {
        sts: false,
        msg: "Session Expired Please Login Again",
      };
    } else {
      console.log("enter...... else refres catch block");
      return {
        sts: false,
        msg: "Session Expired Please Login Again",
      };
    }
  }
}

const authMiddleware = async (req, res, next) => {
  console.log("enter auth ........................1111");
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(200).json({ msg: "Access token required", code: 400 });
  }
  if (authHeader.split(" ")[0] !== "Bearer") {
    return res.status(200).json({ msg: "Invalid Token Method!", code: 400 });
  }

  try {
    const userDetail = jwt.decode(accessToken);
    console.log(userDetail, "============");
    if (!userDetail) {
      return res.status(200).json({ msg: "Bad Request!", code: 400 });
    }
    const { userId } = userDetail;
    if(!userId){
      return res.status(200).json({msg:"Bad GateWay!", code : 400})
    }
    const getUserDetail = await USERMODEL.findById({ _id: userId });
    if (!getUserDetail) {
      return res.status(200).json({ msg: "User Not Found!", code: 400 });
    }
    
    
    const decoded = jwt.verify(accessToken, getUserDetail?.user_secretkey);
    console.log(decoded, "//////// decoded");
    req.user = getUserDetail;
    return next();
  } catch (err) {
    console.log(err);
    console.log("enter auth catch.............");
    if (err.name === "TokenExpiredError") {
      console.log("enter token expired................");
      try {
        // Validate the refresh token
        const decoded = jwt.decode(accessToken);
        console.log(decoded, ".......... token decodedddddddd");
        const userId = decoded ? decoded.userId : null;
        console.log(userId, "//////// user id");
        const user = await getUserByRefreshToken(userId);
        console.log(user, ",kjhgfhjkjhg///////// user");
        if (!user.sts) {
          return res.status(200).json({ msg: user?.msg, code: 400 });
        } else {
          console.log(".............. enrerer");
          return res.status(200).json({ token: user?.accessToken, code: 201 });
        }
      } catch (error) {
        return res
          .status(200)
          .json({ msg: "Error refreshing token", code: 400 });
      }
    }
    console.log("enter, normal errior");
    return res.status(200).json({
      msg: "Internal Server Error!",
      code: 500,
    });
  }
};

module.exports = { authMiddleware };
