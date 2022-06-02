require('./models/User');
require('./models/Trip');
require('./models/Day');
require('./models/GroupBudget');
require('./models/PersonalBudget');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouters = require('./routes/authRoutes');
const country = require('./routes/countries-state-city');
const updateUser = require('./routes/userUpdate');
const requireAuth = require('./middlewares/requireAuth');
const tripRoutes = require("./routes/tripRoutes");
const dayRoutes = require("./routes/dayRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const attractionsRoutes = require("./routes/attractionsRoutes");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

app.use(bodyParser.json());
app.use(authRouters);
app.use(country);
app.use(updateUser);
app.use(tripRoutes);
app.use(dayRoutes);
app.use(budgetRoutes);
app.use(attractionsRoutes);



//the address to our mongoDB
const mongoUri = 'mongodb+srv://admin:admin@cluster.eghkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//mongoose is our way to comunicate with mongo
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.log('Error', err);

});

// const corsOptions ={
//     origin:'http://localhost:3001', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
//the user can use this route only if he has a valid token - checked in requireAuth
app.get('/', requireAuth, (req, res) => {
    res.send(`Your email : ${req.user.email}`);
});

app.listen(3001, () => {
    console.log("listening on port 3001");
})