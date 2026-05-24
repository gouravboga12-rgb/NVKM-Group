const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Handle unconfigured/fallback mode
      if (!supabase.isConfigured) {
        req.user = {
          id: decoded.id || 'mock-user-id-555',
          name: 'NVKM Customer',
          phone: '9014274293',
          email: 'customer@nvkm.com'
        };
        return next();
      }

      // Fetch user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, phone, email')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

module.exports = { protect };

