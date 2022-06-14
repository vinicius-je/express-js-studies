const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On cliente, also delete the acessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content to send back 
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        // erase the cookie
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    };
    // Delete the refreshToken in db
    foundUser.refreshToken = '';
    foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true - only servers on https (add in production)
    res.sendStatus(204);
}

module.exports = { handleLogout }