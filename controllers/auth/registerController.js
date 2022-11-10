const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (request, response) => {
  try {
    const { username, mail, password } = request.body;

    //check if user exists
    const userExists = await User.exists({ mail: mail.toLowerCase() })

    if (userExists) {
      return response.status(409).send('E-mail already in use.');
    }

    //encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //create user document and save in database
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    //create JWT token
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

    response.status(201).json({
      userDetails: {
        mail: user.mail,
        token,
        username: user.username,
        _id: user._id,
      },
    });
  } catch (error) {
    return response.status(500).send('Error occured. Please try again.');
  }
};


module.exports = registerController;
