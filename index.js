require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const sequelize = require('./sequelize')
require('./association')

const user = require('./routes/user.route')
const level = require('./routes/level.route')

const app = express()
const PORT = process.env.PORT || 4545
const env = process.env.NODE_ENV

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())
app.use(express.json())

app.use('/users', user)
app.use('/levels', level)

app.get('/', function (req, res) {
    res.send('Welcome on Switcher API')
})

async function main() {
    try {
        await sequelize.sync()
        await sequelize.authenticate()
        console.log("You've reached switcher DB !")
        app.listen(PORT, (err) => {
            if (err) throw new Error(err.message)
            env !== 'production' &&
                console.log(`Server is runin on http://localhost:${PORT}`)
        })
    } catch (err) {
        console.log('Unable to join DB', err.message)
    }
}

main()

module.exports = app
