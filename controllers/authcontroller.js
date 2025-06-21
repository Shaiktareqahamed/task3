/*const usersDB = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ "message": "Username and password required" });

    const foundUser = usersDB.users.find(user => user.username === username);
    if (!foundUser)
        return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (match){
        const accesstoken = jwt.sign(
            {'username':foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'120s'}
        )
         const refreshtoken = jwt.sign(
            {'username':foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        )
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])
            fsPromises.writeFile(
                  path.join(__dirname, '..', 'models', 'users.json'),
                     JSON.stringify(usersDB.users)
)
        res.cookie('jwt', refreshToken, { httpOnly: true })
        res.json({ accessToken })

    }else
        res.sendStatus(401);
};

module.exports = { handleLogin };*/
const usersDB = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userInfo } = require("os");
require('dotenv').config();


const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "Username and password are required." });
    }

    const foundUser = usersDB.users.find(user => user.username === username);

    if (!foundUser) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);
const roles =Object.values(foundUser.roles)
    if (match) {
        const accessToken = jwt.sign(
            { "userInfo":{
                'username':foundUser.username,
                'roles':roles
            } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s' }
        );

        const refreshToken = jwt.sign(
          
                {'username':foundUser.username},
                
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };

        usersDB.setUsers([...otherUsers, currentUser]);

        try {
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'models', 'users.json'),
                JSON.stringify(usersDB.users, null, 2)
            );
        } catch (err) {
            console.error("Error writing to users.json:", err);
            return res.status(500).json({ "message": "Login successful, but failed to save user session. Please try again." });
        }

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure:true});
        res.json({ accessToken });

    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };