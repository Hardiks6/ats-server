'use strict';
var dbConn = require('./../config/db.config');
const bcrypt = require('bcryptjs');

// User object create
var Users = function (user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = bcrypt.hashSync(user.password, 8);
    this.is_deleted = new Date();
    this.created_at = new Date();
    this.updated_at = new Date();
};
Users.create = function (newUser, result) {
    dbConn.query("INSERT INTO users set ?", newUser, function (err, res) {
        if (err) {
            console.log("error", err);
            result(err, null)
        } else {
            console.log(res.insertId);
            result(null, res.insertId)
        }
    });
};
Users.findAll = function (result) {
    dbConn.query("SELECT * FROM users", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            // console.log('users : ', res);
            result(null, res);
        }
    });
};
Users.delete = function (id, result) {
    dbConn.query("DELETE FROM users WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    })

};
Users.findByEmail = function (email, result) {
    dbConn.query("SELECT * FROM users WHERE email = ? ", email, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
Users.findById = function (id, result) {
    dbConn.query("SELECT * FROM users WHERE id = ?", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res[0]);
        }
    });
};
Users.update = function (id, user, result) {
    console.log('Update function called with:', { id, user });

    // Check if the user object has the necessary fields
    if (!user.email || !user.first_name || !user.last_name || !user.password) {
        return result(new Error('Missing fields in user object'), null);
    }

    dbConn.query(
        "UPDATE users SET email = ?, first_name = ?, last_name = ?, password = ?, updated_at = ? WHERE id = ?",
        [user.email, user.first_name, user.last_name, user.password, new Date(), id],
        function (err, res) {
            if (err) {
                console.error('Update error:', err);
                result(err, null);
            } else {
                console.log('Update result:', res);
                result(null, res);
            }
        }
    );
};

module.exports = Users;
