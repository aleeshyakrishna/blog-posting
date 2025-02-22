import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
      throw new Error('Access token required');
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      // If access token is expired, try to use refresh token
      const refreshToken = req.header('Refresh-Token');
      if (!refreshToken) {
        throw new Error('Refresh token required');
      }

      const user = await User.findOne({ refreshToken });
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Generate new access token
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '15m' }
        );

        res.setHeader('New-Access-Token', newAccessToken);
        req.user = { userId: user._id };
        next();
      } catch (error) {
        throw new Error('Invalid refresh token');
      }
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default auth;
