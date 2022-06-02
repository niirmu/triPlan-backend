const assert = require("assert");
const User = require("../src/models/User"); 
const Trip = require("../src/models/Trip"); 
const Day = require("../src/models/Day"); 

describe("Day tests" , (done) => {
    let testUser ;
    let testTrip ;
    let testDay1 ;
    let testDay2 ;

    //create user that hold trip
    it('create new User for Trip' ,done => {
        testUser = new User({ email:'test66@gmail.com' ,firstName:"test1" ,lastName:"test1",password:"12345678"});
        testUser.save()
        .then(() => done())
    });

    //create trip
    it('create new Trip' ,done => {
        testTrip = new Trip({ usersId:testUser._id ,name:"My Trip" ,country:"Israel",city:"",urlImage:"",description:"",share:"false"});
        testTrip.save()
        .then(() => done())
    });

    
    //create day
    it('create new Day' ,done => {
        let Attraction = [{name:"old city",type:"attractions",startHour:"08:00",endHour:"10:00",description:"",hoursOpen:"",url:""}]
        testDay1 = new Day({ tripId:testTrip._id ,key:"My Trip" ,title:"Israel",data:Attraction});
        testDay1.save()
        .then(() => done())
    });

    //create day 2
    it('create new Day' ,done => {
        let Attraction = [{name:"old city",type:"attractions",startHour:"08:00",endHour:"10:00",description:"",hoursOpen:"",url:""}]
        testDay1 = new Day({ tripId:testTrip._id ,key:"My Trip" ,title:"Israel",data:Attraction});
        testDay1.save()
        .then(() => done())
    });
    
    //find trip by id
    it('find day by trip id' , done => {
        Day.findOne({tripId:testTrip._id})
        .then((day) => {
            assert(day._id.toString() === testDay1._id.toString())
            done();
        })
     })

     

    //add new attraction to day
    it('add user to the trip' ,done => {
        let Attraction2 = [{name:"pizza",type:"food",startHour:"14:00",endHour:"15:00",description:"",hoursOpen:"",url:""}]
        let arrayAttractios = [testDay1.Attraction ,Attraction2]
        testDay1.set('Attraction', arrayAttractios);
        testDay1.save()
        .then(()=>Day.findOne({tripId:testTrip._id}))
        .then((trip) => {
            assert(trip.AttractionA)
            done();
        })
    })


    it('delete user by id' , done => {
        User.findByIdAndDelete(testUser._id)
        .then(() => User.findOne({email : 'test66@gmail.com'}))
        .then((testUser) => {
            assert(testUser === null)
            done()
        })
    })


    it('delete Trip by id' , done => {
        Trip.findByIdAndDelete(testTrip._id)
        .then(() => Trip.findOne({usersId:testUser._id}))
        .then((testTrip) => {
            assert(testTrip === null)
            done()
        })
    })

    it('delete day' , done => {
        let dayId = testDay1._id
        Day.findByIdAndDelete(testDay1._id)
        .then(() => Day.findOne({_id : dayId}))
        .then((testDay1) => {
            assert(testDay1 === null)
            done()
        })
    })
})
 