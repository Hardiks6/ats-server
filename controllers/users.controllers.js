"use strict";
const jwtUtils = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');
const Users = require('../models/users.model');
const { sendEmail } = require('../utils/emailUtils')

exports.findAll = function (req, res) {
  Users.findAll(function (err, user) {
    // console.log('controller')
    if (err)
      res.send(err);
    // console.log('res', user);
    res.send(user);
  });
};
exports.create = function (req, res) {
  const new_user = new Users(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: 'Please provide all required field' });
  } else {
    Users.create(new_user, function (err, user) {
      if (err)
        res.send(err);
      res.json({ error: false, message: "User added successfully!", data: user });
    });
  }
};
exports.findById = function (req, res) {
  Users.findById(req.params.id, function (err, user) {
    if (err)
      res.send(err);
    res.json(user);  //res.json(user[0]);
  });
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: true, message: 'Please provide all required fields' });
  }

  console.log('Request params:', req.params);
  console.log('Request body:', req.body);

  // Pass the full user object to the update function
  Users.update(req.params.id, req.body, function (err, user) {
      if (err) {
          console.error('Update error in controller:', err);
          res.status(500).send(err);
      } else {
          res.json({ error: false, message: 'User successfully updated' });
      }
  });
};
exports.delete = function (req, res) {
  Users.delete(req.params.id, function (err, user) {
    if (err)
      res.send(err);
    res.json({ error: false, message: 'Users successfully deleted' });
  });
};
exports.login = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  Users.findByEmail(email, function (err, user) {
    if (err) {
      res.status(500).send({ error: true, message: 'Error finding user' });
    } else if (!user || user.length === 0) {
      res.status(404).send({ error: true, message: 'User not found' });
    } else {
      bcrypt.compare(password, user[0].password, function (err, isMatch) {
        if (err) {
          res.status(500).send({ error: true, message: 'Error comparing passwords' });
        } else if (!isMatch) {
          res.status(401).send({ error: true, message: 'Incorrect password' });
        } else {
          const token = jwtUtils.generateToken(user[0]);
          res.status(200).json({ error: false, token });
        }
      });
    }
  });
};
exports.forgotPassword = function (req, res) {
  const email = req.body.email;

  Users.findByEmail(email, function (err, user) {
    if (err) {
      res.status(500).send({ error: true, message: 'Error finding user' });
    } else if (!user || user.length === 0) {
      res.status(404).send({ error: true, message: 'User not found' });
    } else {
      const resetToken = jwtUtils.generateResetToken(user[0]);
      const resetLink = `http://yourwebsite.com/reset-password?token=${resetToken}`;

      sendEmail(user[0].email, 'Password Reset Request', `Click the following link to reset your password: ${resetLink}`)
        .then(() => {
          res.status(200).json({ error: false, message: 'Password reset link sent to your email' });
        })
        .catch((emailError) => {
          console.error('Error sending email:', emailError);
          res.status(500).send({ error: true, message: 'Error sending password reset email' });
        });
    }
  });
};
exports.resetPassword = function (req, res) {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwtUtils.verifyToken(token, process.env.RESET_SECRET_KEY);
    Users.findById(decoded.id, function (err, user) {
      if (err || !user) {
        res.status(404).send({ error: true, message: 'Invalid token or user not found' });
      } else {
        bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
          if (err) {
            res.status(500).send({ error: true, message: 'Error hashing password' });
          } else {
            user.password = hashedPassword;
            Users.update(user.id, user, function (err, result) {
              if (err) {
                res.status(500).send({ error: true, message: 'Error updating password' });
              } else {
                res.status(200).json({ error: false, message: 'Password updated successfully' });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).send({ error: true, message: 'Invalid or expired token' });
  }
};

// Get users with pagination
exports.getUsersWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; 
    const limit = parseInt(req.query.limit) || 10; 

    const offset = page * limit;

    const { rows, count } = await Users.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalPages: totalPages,
      currentPage: page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

