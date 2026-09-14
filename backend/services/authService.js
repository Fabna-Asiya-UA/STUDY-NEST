import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";



const generateUniqueConnectionCode = async () => {

  let code;
  let exists = true;

  while (exists) {

    code = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    exists = await User.exists({
      connectionCode: code,
      role: "teacher"
    });
  }

  return code;
};


// ========================================
// GENERATE ACCESS TOKEN
// ========================================

const generateAccessToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m"
    }
  );
};


// ========================================
// GENERATE REFRESH TOKEN
// ========================================

const generateRefreshToken = (user) => {

  return jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );
};


// ========================================
// REGISTER USER
// ========================================

export const registerUser = async ({
  name,
  email,
  password,
  role = "student"
}) => {

  const existingUser = await User.findOne({
    email
  });

  if (existingUser) {

    throw new Error(
      "Email is already registered"
    );
  }


  const hashedPassword = await bcrypt.hash(
    password,
    10
  );


  // Generate connection code only for teachers
  let connectionCode = null;

  if (role === "teacher") {

    connectionCode =
      await generateUniqueConnectionCode();
  }


  const user = await User.create({

    name,

    email,

    password: hashedPassword,

    role,

    connectionCode

  });


  return {

    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    connectionCode: user.connectionCode

  };
};


// ========================================
// LOGIN USER
// ========================================

export const loginUser = async (
  email,
  password
) => {

  const user = await User.findOne({
    email
  });

  if (!user) {

    throw new Error(
      "Invalid email or password"
    );
  }


  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {

    throw new Error(
      "Invalid email or password"
    );
  }


  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);


  return {

    user: {

      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      connectionCode:
        user.connectionCode

    },

    accessToken,

    refreshToken

  };
};


// ========================================
// REFRESH ACCESS TOKEN
// ========================================

export const refreshAccessToken = async (
  refreshToken
) => {

  if (!refreshToken) {

    throw new Error(
      "Refresh token is required"
    );
  }


  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );


    const user = await User.findById(
      decoded.id
    );


    if (!user) {

      throw new Error(
        "User not found"
      );
    }


    const accessToken =
      generateAccessToken(user);

    return accessToken;

  } catch (error) {

    throw new Error(
      "Invalid or expired refresh token"
    );
  }
};


// ========================================
// GET CURRENT USER
// ========================================

export const getCurrentUser = async (
  userId
) => {

  const user = await User.findById(
    userId
  ).select("-password");


  if (!user) {

    throw new Error(
      "User not found"
    );
  }


  return user;
};


// ========================================
// CHANGE PASSWORD
// ========================================

export const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {

  const user = await User.findById(
    userId
  );


  if (!user) {

    throw new Error(
      "User not found"
    );
  }


  const isPasswordCorrect =
    await bcrypt.compare(
      currentPassword,
      user.password
    );


  if (!isPasswordCorrect) {

    throw new Error(
      "Current password is incorrect"
    );
  }


  user.password =
    await bcrypt.hash(
      newPassword,
      10
    );


  await user.save();


  return {

    message:
      "Password changed successfully"

  };
};