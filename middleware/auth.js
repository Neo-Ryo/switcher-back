const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            message: 'No token provided',
        })
    } else {
        const token = req.headers.authorization.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.SECRET, (err) => {
                if (err) {
                    res.status(401).json({
                        message: 'verification incorrect',
                    })
                } else {
                    next()
                }
            })
        } else {
            res.status(401).json({
                message: 'No token provided',
            })
        }
    }
}
