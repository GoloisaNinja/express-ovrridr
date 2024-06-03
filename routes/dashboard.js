const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const Permission = require('../models/Permission.js');

router.get('/', auth, (req, res) => {
    const errorCode = req.errorCode ? req.errorCode : -1;
    try {
        if (errorCode > 0) {
            res.status(401)
            return res.redirect('/');
        } else {
            res.render('dashboard',
                {
                    title: 'Ovridr Dashboard',
                    cssPath: '/stylesheets/style.css',
                    user: req.user,
                    permissions: req.permissions,
                });
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/products', auth, async (req, res) => {
    const errorCode = req.errorCode ? req.errorCode : -1;
    try {
        if (errorCode > 0) {
            return res.status(errorCode).json({message: "Request failed"});
        }
        if (!req.permissions.permissions.viewProducts) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Internal Server Error"});
    }

})

router.get('/users', auth, async (req, res) => {
    const errorCode = req.errorCode ? req.errorCode : -1;
    try {
        if (errorCode > 0) {
            return res.status(errorCode).json({message: "Request failed"});
        }
        if (!req.permissions.permissions.viewUsers) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const users = await User.find({});
        res.status(200).json(users);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Internal Server Error"});
    }

})

router.get('/permissions', auth, async (req, res) => {
    const errorCode = req.errorCode ? req.errorCode : -1;
    try {
        if (errorCode > 0) {
            return res.status(errorCode).json({message: "Request failed"});
        }
        if (!req.permissions.permissions.viewPermissions) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const permissions = await Permission.find({});
        res.status(200).json(permissions);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Internal Server Error"});
    }

})

module.exports = router;
