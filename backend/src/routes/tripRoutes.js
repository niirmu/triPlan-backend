const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Trip = mongoose.model('Trip');
const Day = mongoose.model('Day');
const User = mongoose.model('User');

const router = express.Router();

router.use(requireAuth);

router.get('/myTrips', async (req, res) => {
    try {
        const trips = await Trip.find({ "usersId": { $in: [req.query.userId] } }); //find all the tracks where the userid=req.query.usersId
        res.send(trips);
    }
    catch (err) { //catches of something went wrong with the save process
        res.status(422).send({ error: err.message });
    }
});

router.get('/sharedTrips', async (req, res) => {
    try {
        const trips = await Trip.find({ "share": true }); //find all the tracks where the userid=req.query.usersId
        res.send(trips);
    }
    catch (err) { //catches of something went wrong with the save process
        res.status(422).send({ error: err.message });
    }
});

router.get('/shareTrip', async (req, res) => {
    try {
        await Trip.findOne({ _id: req.query.tripId }).then(res => {
            Trip.updateOne({ _id: req.query.tripId }, {
                $set: { share: !res.share }
            }).catch(err => { res.status(422).send({ error: err.message }); })
        });
    }
    catch (err) { //catches of something went wrong with the save process
        res.status(422).send({ error: err.message });
    }
});

router.post('/trips', async (req, res) => {
    const { name, country, city, urlImage, description, startDate, endDate } = req.body;

    if (!name) {
        console.log("no name");
    }
    if (!country) {
        console.log("no country");
    }
    if (!city) {
        console.log("no city");
    }
    //  return res.status(422).send({ error: 'You must provide a name and country' });


    try {
        const trip = new Trip({ name, country, city, urlImage, description, usersId: req.body._id, share: false });
        await trip.save();
        res.send(trip);


    } catch (err) { //catches of something went wrong with the save process
        res.status(422).send({ error: err.message });
    }
});

router.delete('/deleteTrip', async (req, res) => {
    try {
        const { tripId } = req.body;
        if (tripId)
            await Trip.deleteOne({ _id: tripId }).then(() => { 
                Day.deleteMany({tripId : tripId}).then(() => { 
                res.status(200).send("trip delete") })});
    }
    catch (err) { //catches of something went wrong with the save process
        res.status(422).send({ error: err.message });
    }
});


router.put('/updateTripUserIdGroup', async (req, res) => {
    const { tripId, tags } = req.body;

    try {
        let objectIdsToCheck = [];
        for (let email of tags) {
            const user = await User.findOne({ email });  //find the user where the email=the given tag
            if (!user) { //if there was no such user in mongoDB
                return res.status(422).send({ error: 'Email not found , please try again.' });
            }
            objectIdsToCheck.push(user._id);
        }
        const trip = await Trip.findOne({ _id: tripId });  //find the user where the email=the given tag
        const tripUserId = trip.usersId; //add to this list the new objID

        for (let member of objectIdsToCheck) {
            if (!(tripUserId.includes(member))) {
                tripUserId.push(member);
            }
        }
        const updateMembers = await Trip.updateOne({ _id: tripId }, { $set: { usersId: tripUserId } });
        res.send("success");

    } catch {
        res.status(422).send({ error: 'A problem occured while trying to update trip members , please try again.' });
    }
});


module.exports = router;
