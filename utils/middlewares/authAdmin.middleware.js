const createError = require('../errors/createError.js');

const isAuthAdmin = (request, response, next) => {
    if(request.isAuthenticated() && request.user.role === "admin"){
        return next();
    } else {
        return next((createError('No tienes permisos para acceder, haz login / register para acceder', 401)))
    }
}

module.exports =  isAuthAdmin;