const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nvkm_super_secret_jwt_key_2026');

      // Handle unconfigured/fallback mode
      if (!supabase.isConfigured) {
        const { readData } = require('../utils/mockDb');
        const users = readData('users.json');
        const user = users.find(u => u.id === decoded.id);
        
        if (decoded.id === 'mock-admin-id') {
          req.user = {
            id: 'mock-admin-id',
            name: 'Janagonda Naveen',
            phone: '9014274293',
            email: 'janagondanaveen@gmail.com',
            role: 'admin'
          };
        } else {
          req.user = user || {
            id: decoded.id || 'mock-user-id-555',
            name: 'NVKM Customer',
            phone: '9014274293',
            email: 'customer@nvkm.com',
            role: 'user'
          };
        }
        return next();
      }

      // Fetch user from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, phone, email, role')
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

const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only.' });
  }
};

module.exports = { protect, adminProtect };


