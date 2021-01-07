const Sequelize = require('sequelize')
const sequelizeInstance = require('../sequelize')

const Level = sequelizeInstance.define('Level', {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    name: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
})

module.exports = Level
