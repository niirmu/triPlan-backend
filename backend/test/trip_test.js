const assert = require("assert");
const User = require("../src/models/User"); 
const Trip = require("../src/models/Trip"); 

describe("Trip tests" , (done) => {
    let testUser ;
    let testUser2 ;
    let testTrip ;
    
    //create user that hold trip
    it('create new User for Trip' ,done => {
        testUser = new User({ email:'test66@gmail.com' ,firstName:"test1" ,lastName:"test1",password:"12345678"});
        testUser.save()
        .then(() => done())
    });

    //create user that hold trip
    it('create new User 2 for Trip' ,done => {
        testUser2 = new User({ email:'test56@gmail.com' ,firstName:"test1" ,lastName:"test1",password:"12345678"});
        testUser2.save()
        .then(() => done())
    });
    

    //create trip
    it('create new Trip' ,done => {
        testTrip = new Trip({ usersId:testUser._id ,name:"My Trip" ,country:"Israel",city:"",urlImage:"",description:"",share:"false"});
        testTrip.save()
        .then(() => done())
    });

    //find trip by id
    it('find trip by id' , done => {
        Trip.findOne({_id:testTrip._id})
        .then((trip) => {
            assert(trip._id.toString() === testTrip._id.toString())
            done();
        })
    })

    //find one by id
    it('find trip by id of user' , done => {
        Trip.findOne({usersId: testUser._id})
        .then((trip) => {
            assert(trip._id.toString() === testTrip._id.toString());
            done();
        })
    })

    //update description
    it('update description' ,done => {
        testTrip.set('description', 'the best friend trip');
        testTrip.save()
        .then(()=>Trip.findOne({_id: testTrip._id}))
        .then((trip) => {
            assert(trip.description === 'the best friend trip')
            done();
        })
    })

    
    //add user 2 to the trip
    it('add user to the trip' ,done => {
        let arrayOfUsers = [testUser._id,testUser2._id]
        testTrip.set('usersId', arrayOfUsers);
        testTrip.save()
        .then(()=>Trip.findOne({_id: testTrip._id}))
        .then((trip) => {
            assert(trip.usersId[0].toString() ===testUser._id.toString() &&trip.usersId[1].toString() ===testUser2._id.toString() )
            done();
        })
    })

    //remove user from the trip.
    it('remove user from the trip' ,done => {
        let arrayOfUsers = [testUser._id]
        testTrip.set('usersId', arrayOfUsers);
        testTrip.save()
        .then(()=>Trip.findOne({_id: testTrip._id}))
        .then((trip) => {
            assert(trip.usersId.toString() === testUser._id.toString())
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

    
    it('delete user 2 by id' , done => {
        User.findByIdAndDelete(testUser2._id)
        .then(() => User.findOne({email : 'test56@gmail.com'}))
        .then((testUser2) => {
            assert(testUser2 === null)
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
})
 