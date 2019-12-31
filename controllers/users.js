const bycrpt = require('bycrptjs');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
    bycrpt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hash,
            role: req.body.role
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'User created successfully.',
                data: result
            });
            console.log(chalk.green('User Created at ' + Date()));
        }).catch(error => {
            res.status(500).json({
                message: "Failed to create user.",
                error: error,
            });
            throw new Error(error);
        });
    });
}

