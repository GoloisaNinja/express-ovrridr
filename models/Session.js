const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema(
    {
        session_token: String,
        user_id: String,
        expiresAt: Date,
    }
);

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;