const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On cliente, also delete the acessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content to send back 
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const foundUser = usersDB.users.find(person => person.refreshToken == refreshToken);
    if (!foundUser) {
        // erase the cookie
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    };
    // Delete the refreshToken in db
    const othersUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers({...othersUsers, currentUser});
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true - only servers on https (add in production)
    res.sendStatus(204);
}

module.exports = { handleLogout }