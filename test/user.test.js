const chai = require('chai')
const chaiHttp = require('chai-http')
const User = require('../model/User.model')
const auth = require('../middleware/auth')

let should = chai.should()
let server = require('../index')

const sequelizeInstance = require('../sequelize')
const jwt = require('jsonwebtoken')

chai.use(chaiHttp)

let userTest
let token

const userKeys = [
    'uuid',
    'pseudo',
    'picture',
    'Level',
    'createdAt',
    'updatedAt',
]

describe('USERS', () => {
    before(async () => {
        await sequelizeInstance.sync({ force: true })
        userTest = await User.findCreateFind({
            where: { pseudo: 'userTest' },
            defaults: {
                pseudo: 'userTest',
                password: 'toto',
                picture: 'https://i.imgur.com/fywaJZk.jpg',
            },
        })
        token = jwt.sign(
            {
                id: userTest[0].dataValues.uuid,
                pseudo: userTest[0].dataValues.pseudo,
            },
            process.env.SECRET,
            { expiresIn: '24h' }
        )
    })
    describe('get all users', () => {
        it('should return an array of user', async () => {
            try {
                const users = await chai.request(server).get('/users')
                users.should.have.status(200)
                users.body.should.be.a('array')
            } catch (error) {
                throw error
            }
        })
    })
    describe('get a specific user', () => {
        it('should return an object with user keys', async () => {
            try {
                const user = await chai
                    .request(server)
                    .get(`/users/${userTest[0].dataValues.uuid}`)
                    .set('Authorization', `Bearer ${token}`)
                user.should.have.status(200)
                user.body.should.be.a('object')
                user.body.should.have.all.keys(userKeys)
            } catch (error) {
                throw error
            }
        })
    })
    describe('post a user', () => {
        it('should return an uuid and a token or a message ', async () => {
            try {
                const user = await chai.request(server).post('/users', {
                    pseudo: 'xyz',
                    password: 'test1',
                })
                console.log('USER ===> ', user.statusCode)
                console.log('USER MESSAGE ===> ', user.text)
                if (
                    (user.statusCode === 400) &
                    (user.text === '{"message":"pseudo already taken!"}')
                ) {
                    user.should.have.status(400)
                    user.body.should.be.a('object')
                    user.body.should.have.all.keys('message')
                } else {
                    user.should.have.status(201)
                    user.body.should.be.a('object')
                    user.body.should.have.all.keys('uuid', 'token')
                }
            } catch (error) {
                throw error
            }
        })
    })
})
