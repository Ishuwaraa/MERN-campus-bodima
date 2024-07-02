const jwt = require('jsonwebtoken');

const genAccessToken = (id) => jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
const genRefreshToken = (id) => jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
const genResetPassToken = (id) => jwt.sign({ id }, process.env.RESET_PASS_TOKEN_SECRET, { expiresIn: '10m' });

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];    //auth header is, Bearer token
    if(!authHeader) return res.status(401).json({ msg: 'Authorization header is missing' });

    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({ msg: 'No token found' });
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) return res.status(403).json({ msg: err.message });
        
        req.user = data.id;
        next();
    })
}

module.exports = { genAccessToken, genRefreshToken, genResetPassToken, verifyJWT };