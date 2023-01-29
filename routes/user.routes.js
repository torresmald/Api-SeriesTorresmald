const express = require('express');
const passport = require('passport');
const Serie = require('../model/Series');
const User = require('../model/Users');
const userRouter = express.Router();
const createError = require('../utils/errors/createError.js');
const isAuthAdmin = require('../utils/middlewares/authAdmin.middleware.js');

userRouter.get('/', async (request, response, next) => {
    try {
        const allUsers = await User.find({}, {password: 0}).sort({role: 1});
        if (allUsers.length === 0) {
            return response.status(200).json('No hay usuarios registrados');
        }
        return response.status(200).json(allUsers)
    } catch (error) {
        return next(error)
    }
})
userRouter.post('/register' , async (request, response, next) => {
    const done = (error, user) => {
        if (error) {
            return next(error);
        }
        request.logIn(
            user,
            (error) => {
                if (error) {
                    return next(error)
                }
                return response.status(201).json(user)
            }
        )
    }
    passport.authenticate('register', done)(request);
});
userRouter.post('/login', async (request, response, next) => {
    const done = (error, user) => {
        if (error) {
            return next(error);
        }
        request.logIn(
            user,
            (error) => {
                if (error) {
                    return next(error);
                }
                return response.status(200).json(user);
            }
        )
    }
    passport.authenticate('login', done)(request);
});
userRouter.post('/logout', async (request, response, next) => {
    if (request.user) {
        request.logOut(() => {
            request.session.destroy(() => {
                response.clearCookie('connect.sid');
                response.status(200).json('Te has deslogueado con éxito')
            })
        })
    } else {
        return response.status(304).json('No hay usuario logueado')
    }
});


module.exports = userRouter;