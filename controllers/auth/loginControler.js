const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginControler = async (request, response) => {
  try {
    const { mail, password } = request.body;

    const user = await User.findOne({ mail: mail.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      //send new token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '24h',
        },
      );

      return response.status(200).json({
        userDetails: {
          mail: user.mail,
          token,
          username: user.username,
          _id: user._id,
        },
      });
    }

    return response.status(400).send('Invalid credentials. Please try again.');
  } catch (error) {
    return response.status(500).send('Something went wrong. Please try again.');
  }
};

module.exports = loginControler;
