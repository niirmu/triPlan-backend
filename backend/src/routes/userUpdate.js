const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

router.put('/updateImage', async (req, res) => {
    
    let _id = req.body._id;
    let uri = req.body.localUri;

    //get type from uri 
    let uriSplit = uri.split(',');
    let type = uriSplit[0];
    let data = type.split(':');
    let ImageType = data[1].split(';');
    ImageType = ImageType[0];

    try {
        
        await User.updateOne({ _id }, {$set: {image: {data: uri , contentType : ImageType}} });

    } catch (err) {
        return res.status(422).send({ error: 'cant update image. try again later.' });
    }
});

module.exports = router;