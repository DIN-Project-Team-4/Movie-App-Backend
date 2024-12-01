import { createUser } from './models/userModel.js'
import { validateUser } from './models/authModel.js'
import {expect} from 'chai'
import fetch from 'node-fetch'; // Ensure node-fetch is up to date
import request from 'supertest';
import express from 'express';

const base_url = 'http://localhost:3001'

// Helper function to get access token
const getAccessToken = async () => {
  const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
  
  // Define the payload
  const payload = {
  };

  // Generate JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Set expiration time to 1 hour
  return token;

};



// Test for deleting user account
describe('DELETE /api/v1/user/:id', () => {
  it('should delete the user account', async () => {
    const app = express(); // Create an instance of Express


    // Generate JWT token for authorization
    const accessToken = getAccessToken();

    const userId = 'dsjfhlksdjf';

    console.log('Base URI:', process.env.BASE_URI);



    // Make the DELETE request with the generated token
    const response = await request(app)
      .delete(`/api/v1/delete/${userId}`)
      .set('Cookie', `access_token=${accessToken}`);  // Set the cookie with the JWT token

    // Check the response status and message
    expect(response.status).to.equal(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });

  it('should return 401 for unauthorized access (missing or invalid token)', async () => {
    const userId = '12345';
    const app = express(); // Create an instance of Express

    // Make the DELETE request without a token
    const response = await request(app)
      .delete(`/api/v1/delete/${userId}`)
      .set('Cookie', 'access_token=');

    // Check the response status and error message
    expect(response.status).to.equal(401);
    expect(response.body.error).toBe('Unauthorized access. Invalid or missing token.');
  });
});

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
describe('Review', () => {
  it('try to add review without sign in', async () => {
    const response = await fetch(`${base_url}/movie/createReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "movieId": 10,
        "description": "Bad",
        "rating": 2,
        "reviewedAt": "2024-11-20 06:30:30+02",
        "userId": 0,
      }),
    });
    const data = await response.json();

    expect(response.status).to.equal(401);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});
