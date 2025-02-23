import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded; 
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('🔄 Access token expired, trying refresh token...');
      } else {
        return res.status(401).json({ error: 'Invalid access token' });
      }
    }

    const refreshToken = req.header('Refresh-Token');
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '20m' }
      );

      res.setHeader('New-Access-Token', newAccessToken);
      req.user = { userId: user._id };
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default auth;
