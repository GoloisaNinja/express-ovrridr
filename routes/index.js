const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Session = require('../models/Session.js');
const auth = require('../middleware/auth/auth.js');
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Overidr Login', cssPath: '/stylesheets/style.css' });
});

router.post('/login', async function(req, res) {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(401).json({message: "invalid email or password"});
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({message: "invalid email or password"});
  }
  const isMatch = password === user.password;
  if (!isMatch) {
    return res.status(401).json({message: "invalid email or password"});
  }
  const cookieExpiresInDays = 1
  let expiresAt = cookieExpiresInDays*24*60*60*1000;
  const session_token = uuidv4();
  const session = {
    session_token,
    user_id: user.id,
    expiresAt
  }
  const newSession = new Session(session);
  await newSession.save();
  res.cookie('session_token', session.session_token, {maxAge: session.expiresAt});
  res.status(200).json({message: "success"});
})

router.post('/logout', auth, async function(req, res) {
  const errorCode = req.errorCode ? req.errorCode : -1;
  try {
    if (errorCode > 0) {
      return res.status(errorCode).json({message: "Logout failed"});
    }
    let cookieDBDocument = null;
    const sessionToken = req.cookies['session_token'];
    cookieDBDocument = await Session.findOneAndDelete({session_token: sessionToken})
    if (cookieDBDocument == null) {
      throw new Error();
    }
    res.clearCookie('session_token');
    res.status(200).json({message: "Logout success"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
})

module.exports = router;
