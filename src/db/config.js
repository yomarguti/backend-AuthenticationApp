const User = require('../models/user');
const Token = require('../models/token');

User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });
Token.belongsTo(User);
