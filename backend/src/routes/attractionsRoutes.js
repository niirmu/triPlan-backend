const { error } = require('console');
const { query } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const Day = mongoose.model('Day');
const Attraction = mongoose.model('Attraction');
const router = express.Router();

const UrlPlacesApi = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
const UrlDetailsApi = "https://maps.googleapis.com/maps/api/place/details/json?";
const key = "AIzaSyBcZADXVlfRvJGg8pbCQsKtTT7_7GEO5ew";

router.post('/attractionsByQuary', async (req, res) => {
    try {
        const {attraction ,area, pagetoken} = req.body;
        let url = UrlPlacesApi + "query=[" + attraction + ',' + area + "]&key=" + key ;
        if(pagetoken)
          url += "&pagetoken=" + pagetoken;

        https.get(url, function(response) {
            if(response.statusMessage === 'OK')
            {
                let body ='';
                response.on('data', function(chunk) {
                  body += chunk;
                });
                response.on('end', function() {
                    let places = JSON.parse(body);
                    res.json(places);
                  });                  
            }
            else
                throw error('server failed , please try again later.');
          }).on('error', function(err) {
            return res.status(422).send(err.message);
          });

    }
    catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/attractionDetails', async (req, res) => {
  try {
      const {placeId} = req.body;

      let url = UrlDetailsApi + "place_id=" + placeId + "&key=" + key ;
      https.get(url, function(response) {
          if(response.statusMessage === 'OK')
          {
              let body ='';
              response.on('data', function(chunk) {
                body += chunk;
              });
              response.on('end', function() {
                  let places = JSON.parse(body);
                  res.json(places);
                });                  
          }
          else
            return res.status(422).send("cant get api request , try again later.");
        }).on('error', function(err) {
          return res.status(422).send(err.message);
        });

  }
  catch (err) {
      return res.status(422).send(err.message);
  }
});

router.put('/addAttraction', async (req, res) => {
  const {dayId , name, type , startHour ,endHour , description ,hoursOpen , url} = req.body;

  try {
      let attr = new Attraction({name, type , startHour ,endHour , description ,hoursOpen , url});
      const day = await Day.updateOne({ _id: dayId }, {$push:{data : attr}});
      
      res.send();
  } catch (err) {
      res.status(422).send({ error: err.message });
  }
});

module.exports = router;
