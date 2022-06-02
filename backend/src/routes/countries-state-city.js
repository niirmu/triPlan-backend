const express = require('express');
const jwt = require('jsonwebtoken');
const Country = require('country-state-city').Country;
const City = require('country-state-city').City;

const router = express.Router();

router.get('/country', async (req, res) => {
    try {
        res.send(Country.getAllCountries());
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});

router.get('/city', async (req, res) => {
    try {
        res.send(City.getCitiesOfCountry(req.query.country));
    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});


module.exports = router;
