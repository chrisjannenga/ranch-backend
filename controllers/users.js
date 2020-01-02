const bycrpt = require('bcryptjs');
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
            console.log(chalk.magenta('User Created at ' + Date()));
        }).catch(error => {
            res.status(500).json({
                message: "Failed to create user.",
                error: error,
            });
            throw new Error(error);
        });
    });
}

exports.login = (req, res, next) => {
    let fetchedUser;
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Authentication Failed... User not found.'
            });
        }
        fetchedUser = user;
        console.log(chalk.magenta(user));
        return bycrpt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Wrong password. Please try again"
            });
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
        }, process.env.JWT_KEY, {
            expiresIn: '1hr'
        });
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    }).catch(error => {
        res.status(401).json({
            message: "Invalid credentials... Please try again.",
            error: error
        })
    })
}

