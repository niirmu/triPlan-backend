const mongoose = require('mongoose');

const travelsShcema = new mongoose.Schema({
    x: {
        type: String,
        default: ''
    },
    y: {
        type: Number,
        default: 1
    }
});


const budgetSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    },
    //the travels
    data: [travelsShcema]
});

mongoose.model('Group', budgetSchema);
