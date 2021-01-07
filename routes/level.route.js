const express = require('express')
const level = express.Router()
const Level = require('../model/Level.model')

level.get('/', async (req, res) => {
    try {
        const levelRes = await Level.findAll()
        res.status(200).json(levelRes)
    } catch (error) {
        res.status(400).json(error)
    }
})

level.get('/:userUuid', async (req, res) => {
    const { userUuid } = req.params
    try {
        const levelRes = await Level.findOne({ where: { userUuid } })
        res.status(200).json(levelRes)
    } catch (error) {
        res.status(400).json(error)
    }
})

level.post('/:userUuid', async (req, res) => {
    const { userUuid } = req.params
    try {
        const levelRes = await Level.create({ UserUuid: userUuid })
        res.status(202).json(levelRes)
    } catch (error) {
        res.status(400).json(error)
    }
})

level.put('/:userUuid/levelUp', async (req, res) => {
    const { userUuid } = req.params
    try {
        const levelRes = await Level.increment(
            { name: 1 },
            { where: { UserUuid: userUuid } }
        )
        res.status(200).json(levelRes)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = level
