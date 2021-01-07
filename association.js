const User = require('./model/User.model')
const Level = require('./model/Level.model')

User.hasOne(Level)
Level.belongsTo(User)