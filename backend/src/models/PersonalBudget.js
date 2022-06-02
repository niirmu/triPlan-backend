const mongoose = require('mongoose');

const typeSpendShcema = new mongoose.Schema({
    x: {
        type: String,
        default: ''
    },
    y: {
        type: Number,
        default: 1
    }
});

const budgetPersonalSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    data: [typeSpendShcema]
});

mongoose.model('Personal', budgetPersonalSchema);
