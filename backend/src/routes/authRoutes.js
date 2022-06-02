const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const validator = require('validator');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { password , confirmPassword, firstName, lastName, profileDefultImage} = req.body;
    let { email } = req.body;
    email = String(email).toLowerCase();

    try {
        if(!validator.isEmail(email))
            throw new Error('email not valid');
        else if(password !== confirmPassword)
        {
            throw new Error('password not match');
        }   
        const userCheck = await User.findOne({ email });
        if (userCheck) { //if there already such user in mongoDB
            return res.status(422).send({ error: 'Email already register. try to log in' });
        }
        let user = new User({ email,firstName ,lastName , password , image:{data:profileDefultImage , contentType: 'image/png'}});

        await user.save();

        //the 1st arg of "sign" is what we want to encode = the user's id, the 2nd is a key unique to our DB
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        user = await User.findOne({ email });
        
        res.send({ token , user }); //we are going to usr this token in future requests
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { password } = req.body;
    let { email } = req.body;
    email = String(email).toLowerCase();
    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }
    const user = await User.findOne({ email });
    if (!user) { //if there was no such user in mongoDB
        return res.status(422).send({ error: 'Email not found , please register.' });
    }
    try {
        if(!validator.isEmail(email))
            throw new Error('email not valid');
        if(!password)
            throw new Error('password empty');
            
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');

        res.send({ token , user});
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
}); 

router.delete('/deleteAccount', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(422).send({ error: 'Must provide email' })
    }
    try {
        await User.deleteOne({ email }).then(() => {res.status(200).send("account deleted");})
    } catch (err) {
        return res.status(422).send({ error: 'cant delete right now , try again later.' });
    }
});

module.exports = router;
