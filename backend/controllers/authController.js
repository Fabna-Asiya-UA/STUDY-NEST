import {
  registerUser,
  loginUser
} from "../services/authService.js";


// ========================================
// REGISTER
// ========================================

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user
    });

  } catch (error) {
    next(error);
  }
};


// ========================================
// LOGIN
// ========================================

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const result = await loginUser(
      email,
      password
    );

    res.status(200).json({
      success: true,

      user: result.user,

      accessToken: result.accessToken,

      refreshToken: result.refreshToken
    });

  } catch (error) {
    next(error);
  }
};