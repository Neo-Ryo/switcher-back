const chai = require('chai')
const chaiHttp = require('chai-http')
const User = require('../model/User.model')

let should = chai.should()
let server = require('../index')

const sequelizeInstance = require('../sequelize')
const jwt = require('jsonwebtoken')

chai.use(chaiHttp)

describe('USERS', () => {
    before(async () => {
        await sequelizeInstance.sync()
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
})
