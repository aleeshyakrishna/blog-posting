
import User from '../model/userSchema.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from "../utils/AppError.js";
import configKeys from '../config/configKeys.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    configKeys.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    configKeys.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };

};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      
      return next(new AppError("User already exists", 400));

    }

    const user = new User({ username, email, password });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save();
// console.log(accessToken,refreshToken,"tokens");

    res.status(201).json({ message:"user registered successfully ✅ ",accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return next(new AppError("something went wrong", 404));
    
  }
};

const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid credentials, please try again", 400));
    }
    console.log(user,"000000000");
    
    const isMatch = await user.comparePassword(password);
    console.log(isMatch,"---->>>>");
    
    if (!isMatch) {
        return next(new AppError("Invalid credentials, please try again", 400));
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    next(error)
  }
};


const logout = async (req, res) => {
  try {
    const refreshToken = req.header('Refresh-Token');

    if (!refreshToken) {
      return next(new AppError("Refresh token required", 400));

    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return next(new AppError("Invalid or expired refresh token", 401));

    }

    
    const user = await User.findOneAndUpdate(
      { _id: decoded.userId, refreshToken },
      { $set: { refreshToken: null } },
      { new: true }
    );

    if (!user) {
      return next(new AppError("Invalid refresh token", 400));

    }

    console.log("Logged out successfully");
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    return next(new AppError("something went wrong", 404));
  }
};



export default { register, login, logout };