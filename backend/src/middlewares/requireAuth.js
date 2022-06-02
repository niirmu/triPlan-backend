const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

/*
this is a function that receives a request and does some pre-proccessing on it.
here we are going to make sure that the user includes a token, and if so, we will allow
them to access some given routes in the app. 

this middleware extracts the jwt, extracts the user id out of it, uses that id to find the right user
inside of our db and then assigned that user model to our req object
*/


module.exports = (req, res, next) => {

    //whenever a user tries to authenticate themselves, they need to provide their token inside the header section
    //authorization === 'Bearer gphkpokfgvsprfseoif'
    const { authorization } = req.headers;

    //if the user didn't provide an authorization header -> it's not a valid request
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }
    //if the user passed that check, that means they provided a valid token, and we want to extract it
    const token = authorization.replace('Bearer ', ''); //we are left with the token only after the replace
    jwt.verify(token, 'MY_SECRET_KEY', async (err, paylod) => { //validate the token
        if (err) { //something went wrong with the varification process
            return res.status(401).send({ error: 'You must be logged in.' })
        }
        const { userId } = paylod; //everything is ok so we get the id as the payload
        const user = await User.findById(userId); //find the user in mongoDB through mongoose
        req.user = user; //attach the user to the request
        next(); //we can call the next middleware if there is one
    });
};