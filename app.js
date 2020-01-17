const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    let publicKey = fs.readFileSync('pem/public.key');
    jwt.verify(req.token, publicKey, (err, authData) => {
        if(err || !authData.user.roles.includes('employee')){
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            })
        }
    })
});

app.post('/api/login', (req, res) => {
    let privateKey = fs.readFileSync('pem/private.key');
    //Mock User
    const user = {
        id: 1,
        username: 'Sneha',
        email: 'sneha.ramnath@gmail.com',
        roles: ['employee', 'admin']
    }

    jwt.sign({ user }, privateKey , {algorithm: 'RS256', expiresIn: '1d'},  (err, token) => {
        res.json({
            token
        })
    })
}); 

// Verify token
function verifyToken(req, res, next) {
    // Get auth header val
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        //get token
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server started on port 5000'));