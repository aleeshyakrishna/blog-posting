// // controllers/userController.js
// export const userControllers = {
//   userSignup: async (req, res) => {
//     try {

//       console.log("User signup logic goes here...");
      
//       res.status(200).json({ message: "User signed up successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Error during signup" });
//     }
//   },
// };

import User from '../model/userSchema.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };

};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save();
// console.log(accessToken,refreshToken,"heyyyyyyy");

    res.status(201).json({ message:"user registered successfully ✅ ",accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
    
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials, please try again' });
    }
    console.log(user,"000000000");
    
    const isMatch = await user.comparePassword(password);
    console.log(isMatch,"---->>>>");
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials, please try again' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.header('Refresh-Token');
    
    // Find user and remove refresh token
    await User.findOneAndUpdate(
      { refreshToken },
      { $set: { refreshToken: null } }
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }

};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.header('Refresh-Token');
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      // If refresh token is expired, remove it and require re-login
      user.refreshToken = null;
      await user.save();
      return res.status(401).json({ error: 'Refresh token expired' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default { register, login, logout, refreshAccessToken };