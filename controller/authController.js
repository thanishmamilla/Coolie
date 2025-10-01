const AdminUser = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET="radheshyam";

const registerAdmin=async(req,res)=>{
    console.log(req.body);
    const {email,password}=req.body;
    try {
    let user = await AdminUser.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Admin user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new AdminUser({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'Admin user registered' });
  } catch (err) {
    res.status(500).send('Server error');
  }
}




const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    let user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); 
      }
    );

  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};