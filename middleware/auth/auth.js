const Session = require('../../models/Session.js');
const User = require('../../models/User.js');
const Permission = require('../../models/Permission.js');
const ObjectId = require('mongodb').ObjectId


const auth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies["session_token"];
        // Is there a cookie?
        if (!sessionToken) {
            req.errorCode = 401;
            return next();
        }
        const currentSession = await Session.findOne({session_token: sessionToken});
        // Is that cookie in our DB?
        if (!currentSession) {
            req.errorCode = 400;
            return next();
        }
        // Is that db cookie expired?
        if (currentSession.expiresAt > Date.now()) {
            req.errorCode = 401;
            return next();
        }
        const cookieUser = new ObjectId(currentSession.user_id)
        const user = await User.findOne({_id: cookieUser});
        // Is that db cookie tied back to a good user?
        if (!user) {
            req.errorCode = 400;
            return next();
        }
        // Can we get permissions off that user?
        const permissions = await Permission.findOne({"user.id": user._id});
        if (!permissions) {
            req.errorCode = 400;
            return next();
        }
        // We have good user and permissions from db -> send them through
        req.user = user;
        req.permissions = permissions;
        next();
    } catch (error) {
        console.log(error);
        req.errorCode = 401;
        next();
    }
}
module.exports = auth;