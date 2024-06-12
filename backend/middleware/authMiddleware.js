const jwt = require('jsonwebtoken');

const generateAuthToken = (id, name) => {
    const accessToken = jwt.sign({ id, name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s'});
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'});

    const tokens = { accessToken, refreshToken };
    return tokens;
}

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];    //auth header is, Bearer token
//     const token = authHeader && authHeader.split(' ')[1];

//     if(token === null) return res.status(401).json({ msg: 'No token found' });
    
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
//         if(err) return res.status(403).json({ error: err.message });
        
//         req.user = data;
//         next();
//     })
// }

module.exports = { generateAuthToken };