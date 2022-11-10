const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (request, response, next) => {
  let token = request.body.token || request.query.token || request.headers['authorization'];

  if (!token) {
    return response.status(403).send('A token is required for authorization');
  }

  try {
    token = token.replace(/^Bearer\s+/, '');
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    request.user = decoded;
  } catch (error) {
    return response.status(401).send('Invalid token.');
  }

  return next();
};

module.exports = verifyToken;
