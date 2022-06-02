const assert = require("assert");
const User = require("../src/models/User"); 


describe("User tests" , (done) => {
    let testUser ;

    it('create new User' ,done => {
        testUser = new User({ email:'test66@gmail.com' ,firstName:"test1" ,lastName:"test1",password:"12345678"});
        testUser.save()
        .then(() => done())
    });

    //find one by id
    it('find user by id' , done => {
        User.findOne({_id: testUser._id})
        .then((user) => {
            assert(user.email === 'test66@gmail.com')
            done();
        })
    })

    //find one by email
    it('find user by email' , done => {
        User.findOne({email:'test66@gmail.com'})
        .then((user) => {
            assert(user.firstName === "test1")
            done();
        })
    })

    //update first name
    it('update first name' ,done => {
        testUser.set('firstName', 'testUpdateName');
        testUser.save()
        .then(()=>User.findOne({_id: testUser._id}))
        .then((user) => {
            assert(user.firstName === 'testUpdateName')
            done();
        })
    })
    //update pass
    it('update last name' ,done => {
        testUser.set('lastName', 'LastName');
        testUser.save()
        .then(()=>User.findOne({_id: testUser._id}))
        .then((user) => {
            assert(user.lastName === 'LastName')
            done();
        })
    })

    it('delete by id' , done => {
        User.findByIdAndDelete(testUser._id)
        .then(() => User.findOne({email : 'test66@gmail.com'}))
        .then((testUser) => {
            assert(testUser === null)
            done()
        })
    })
})
 