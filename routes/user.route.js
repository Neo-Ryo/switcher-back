const express = require('express')
const jwt = require('jsonwebtoken')
const Level = require('../model/Level.model')

const user = express.Router()

const regExIntChck = require('../middleware/regexCheck')
const { uuidv4RegExp } = require('../middleware/regexCheck')
const auth = require('../middleware/auth')

const User = require('../model/User.model')

user.get('/', async (req, res) => {
    try {
        const user = await User.findAll({
            attributes: { exclude: ['password'] },
            include: Level,
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
})

user.get(
    '/:uuid',
    auth,
    regExIntChck(uuidv4RegExp, 'fake uuid'),
    async (req, res) => {
        const { uuid } = req.params
        try {
            const user = await User.findByPk(uuid, {
                attributes: { exclude: ['password'] },
                include: Level,
            })
            res.status(200).json(user)
        } catch (error) {
            res.status(404).json(error)
        }
    }
)

user.post('/', async (req, res) => {
    const { pseudo, password, picture } = req.body
    try {
        const arrayUsers = await User.findAll({ where: { pseudo } })
        if (arrayUsers.length > 0) {
            throw Error
        } else {
            const user = await User.create({
                pseudo,
                password,
                picture,
            })
            const uuid = user.uuid
            const levelCreater = await Level.create({
                UserUuid: uuid,
            })
            const token = jwt.sign(
                {
                    id: user.dataValues.uuid,
                    pseudo: user.dataValues.pseudo,
                },
                process.env.SECRET,
                { expiresIn: '24h' }
            )
            const level = levelCreater.dataValues.name
            res.status(201).json({ uuid, level, token })
        }
    } catch (error) {
        res.status(400).json({ message: 'pseudo already taken!' })
    }
})

user.post('/login', async (req, res) => {
    const { pseudo, password } = req.body
    try {
        const user = await User.findOne({
            where: { pseudo },
            include: Level,
        })
        if (user.validatePassword(password)) {
            const token = jwt.sign(
                {
                    id: user.dataValues.uuid,
                    pseudo: user.dataValues.pseudo,
                },
                process.env.SECRET,
                { expiresIn: '24h' }
            )
            const uuid = user.uuid
            const level = user.Level.name
            res.status(200).json({ uuid, level, token })
        } else {
            throw Error.error
        }
    } catch (error) {
        res.status(400).json({
            message: 'pseudo or password incorrect, try again',
        })
    }
})

// user.post('/:uuid/level', regExIntChck(uuidv4RegExp), async (req, res) => {
//     const { uuid } = req.params
//     try {
//         const user = await User.increment({ level: 1 }, { where: { uuid } })
//         res.status(204).end()
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })
module.exports = user
