const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Day = mongoose.model('Day');
const Attraction = mongoose.model('Attraction');
const moment = require('moment');


const router = express.Router();

router.use(requireAuth);

router.get('/days', async (req, res) => {
    try {
        const days = await Day.findOne({ dayId: req.day._id });
        res.send(days);
    }
    catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/allDays', async (req, res) => {
    try {
        const days = await Day.find({ tripId: req.query.tripId });
        res.send(days);
    }
    catch (err) {
        res.status(422).send({ error: err.message });
    }
});
router.post('/days', async (req, res) => {
    const { startDate, endDate, tripId } = req.body;

    if (!startDate || !endDate || !tripId) {
        return res
            .status(422)
            .send({ error: 'You must provide a key and title' });
    }

    var a = moment(startDate);
    var b = moment(endDate);
    var key;
    var title;
    try {
    // If you want an exclusive end date (half-open interval)
    for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
        key = m.format('DD/MM/YYYY');  //todo change format to day-mon-year
        title = m.format('DD/MM/YYYY');
        const day = new Day({ key, title, tripId });
        await day.save();
    }
    key = m.format('DD/MM/YYYY');
    title = m.format('DD/MM/YYYY');
    const day = new Day({ key, title, tripId });
    await day.save();
    res.send("update days");

    }
    catch(err){
        res.status(422).send({ error: err.message });
    }
});
router.post('/copyAttraction', async (req, res) => {
    const { sharedtripId, tripId } = req.body;
    try {
        const SharedTripdays = await Day.find({ tripId: sharedtripId });
        const days = await Day.find({ tripId: tripId });

        console.log(`SharedTripdays:${SharedTripdays}`);

        console.log(days.length);
        console.log(days.size);
        let newData;
        let newvalues;
     
        days.forEach(async(dayToUpdate ,index) => {
            if(SharedTripdays[index]){
            newData = SharedTripdays[index].data;
            newvalues = { $set: { data: newData } };
            const day = await Day.updateOne({ _id: dayToUpdate._id }, newvalues)
        }
        });
        res.send("success");
    }
    catch (err) {
        res.status(422).send({ error: err.message });
    }
});





router.put('/updateAttractions', async (req, res) => {
    const { data, dayId } = req.body;
    try {
        var newvalues = { $set: { data: data } };
        const day = await Day.updateOne({ _id: dayId }, newvalues, function (err, res) {
            if (err)
                console.log("1 document updated");
        })

        day.save();
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;

