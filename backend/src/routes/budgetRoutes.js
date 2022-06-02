const e = require('express');
const express = require('express');
const mongoose = require('mongoose');
//const requireAuth = require('../middlewares/requireAuth');
const Personal = mongoose.model('Personal');
const Group = mongoose.model('Group');

const router = express.Router();

//router.use(requireAuth);

router.get('/Budget/Personal', async (req, res) => {
    try{
    const personalBudget = await Personal.findOne({ "userId": { $in: [req.query.userId] }, "tripId": { $in: [req.query.tripId] } });
    res.send(personalBudget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/Budget/Group', async (req, res) => {
    try{
    const groupBudget = await Group.findOne({ "tripId": { $in: [req.query.tripId] } });
    res.send(groupBudget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.post('/Budget/createPersonal', async (req, res) => {
    const { tripId, userId } = req.body;
    try {
        const data = [{ x: "attractions" }, { x: "Shopping" }, { x: "hotels" }, { x: "rides" }, { x: "food" }, { x: "gifts" }]
        const budget = new Personal({ tripId, userId, data });
        await budget.save();
        res.send(budget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.post('/Budget/createGroup', async (req, res) => {
    const { tripId, data } = req.body;

    if (!tripId) {
        return res
            .status(422)
            .send({ error: 'You must provide a trip and user' });
    }

    try {
        const budget = new Group({ tripId, data });
        await budget.save();
        res.send(budget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});


router.post('/Budget/Group', async (req, res) => {
    try{
    const groupBudget = await Group.find({ tripId: req.trip_id, userId: req.user_id });
    res.send(groupBudget);
    }
    catch (err) {
        res.status(422).send({ error: err.message });
    }
});


router.put('/Budget/updatePersonal', async (req, res) => {
    const { tripId, userId, numberPersonal } = req.body;
    try {

        const budget = await Personal.findOne({ tripId: tripId, userId: userId });
        let newData = budget.data;

        for (let obj in budget.data) {
            for (var key in numberPersonal) {
                if (budget.data[obj].x === key) {
                    newData[obj].y = Number(newData[obj].y) + Number(numberPersonal[key]);
                }
            }
        }
        const updateBudget = await Personal.updateOne({ tripId: tripId, userId: userId }, { $set: { data: newData } })
        res.send(updateBudget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});



router.put('/Budget/updateGroup', async (req, res) => {
    const { tripId, numberGroup } = req.body;
    try {
        console.log(req.body);

        const budget = await Group.findOne({ tripId: tripId });
        let newData = budget.data;

        for (let obj in budget.data) {
            for (var key in numberGroup) {
                if (budget.data[obj].x === key) {
                    newData[obj].y = Number(newData[obj].y) + Number(numberGroup[key]);
                }
            }
        }
        const updateBudget = await Group.updateOne({ tripId: tripId }, { $set: { data: newData } })
        res.send(updateBudget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});


router.put('/Budget/updateTeamGroup', async (req, res) => {
    const { tripId, tags } = req.body;
    let newNames = [];

    console.log(tags);
    for (index = 0; index < tags.length; ++index) {
        newNames.push({ 'x': tags[index] });
    };

    console.log(newNames);
    try {
        const budget = await Group.updateOne({ tripId: tripId }, { $push: { data: newNames } }, function (err, res) {
            if (err)
                console.log("1 document updated");
        })

        budget.save();
    } catch (err) {

    }
});




module.exports = router;