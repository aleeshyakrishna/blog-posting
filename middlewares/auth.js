import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';
import configKeys from '../config/configKeys.js';
const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
      return next(new AppError("Access token required", 401));

    }

    try {
      const decoded = jwt.verify(accessToken, configKeys.JWT_ACCESS_SECRET);
      req.user = decoded; 
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log(' Access token expired, trying refresh token...');
      } else {
        return next(new AppError("Invalid access token", 401));

      }
    }

    const refreshToken = req.header('Refresh-Token');
    if (!refreshToken) {
      return next(new AppError("Refresh token required", 401));

    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return next(new AppError("Invalid refresh token", 403));

    }

    try {
      jwt.verify(refreshToken, configKeys.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { userId: user._id },
        configKeys.JWT_ACCESS_SECRET,
        { expiresIn: '20m' }
      );

      res.setHeader('New-Access-Token', newAccessToken);
      req.user = { userId: user._id };
      next();
    } catch (error) {
      return next(new AppError("Invalid or expired refresh token", 403));

    }
  } catch (error) {
    next(error)
  }
};

export default auth;
