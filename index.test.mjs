import { createUser } from './models/userModel.js'
import { validateUser } from './models/authModel.js'
import {expect} from 'chai'

const base_url = 'http://localhost:3001'
//const base_url =  'http://localhost:5050'

//test cases for user accounts
// describe('POST register',() =>{
//     it('should register with valid email and password', async () => {
//         const email = 'login@foo.com';
//         const password = 'login123';
//         const username ='loginuser';
//         const created_at =new Date();
//         const token = getAccessToken();
// console.log(`${base_url}/api/v1/users`);

//         const response = await fetch(`${base_url}/api/v1/users`, {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 authorization: token
//             },
//             body: JSON.stringify({ email, password, username, created_at}),
//         });
        
//         const data = await response.json();
//         expect(response.status).to.equal(201, data.error);
//         expect(data).to.be.an('object');
//         expect(data).to.include.all.keys('id', 'email');
//     });

//     // it('should not post a user with less than 8 Charactors password', async() =>{
//     //     const email= 'register@foo.com';
//     //     const password='short1';
//     //     const response = await fetch(`${base_url}/user`,{
//     //         method:'post',
//     //         headers: {
//     //             'Content-Type' :'application/json'
//     //         },
//     //         body : JSON.stringify({'email':email,'password':password})
//     //     })
//     //     const data =await response.json()
//     //     expect(response.status).to.equal(400,data.error)
//     //     expect(data).to.be.an('object')
//     //     expect(data).to.include.all.keys('error')
//     // })
// })

// Tests for API endpoints for handling movie reviews
//  Try to add review without signing in: should get an error response
//  Try to add review after sign in with jwt token: review should be successfully added
describe('Review',() => {
    it ('try to add review without sign in', async() => {
        const response = await fetch(base_url + '/movie/createReview',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                "movieId": 10,
                "description": "Bad",
                "rating": 2,
                "reviewedAt": "2024-11-20 06:30:30+02",
                "userId": 0
              })
        })
        const data = await response.json()

        expect(response.status).to.equal(401)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})
