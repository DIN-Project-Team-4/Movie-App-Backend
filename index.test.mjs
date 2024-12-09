import { createUser } from './models/userModel.js'
import { validateUser } from './models/authModel.js'
import {expect} from 'chai'
import fetch from 'node-fetch'; // Ensure node-fetch is up to date
import request from 'supertest';
import express from 'express';
import app from './server.js';
import nock from 'nock';


// Helper function to get access token
const getAccessToken = async () => {
  const jwt = require('jsonwebtoken'); // Ensure jwt is imported
  const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

  // Define the payload for the token
  const payload = {
      userId: '12345',
      userEmail: 'user@example.com',
      userName: 'John Doe',
  };

  // Generate JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token valid for 1 hour
  return token;
};


//Testing for sign in
describe('POST /sign-in', () => {
  it('should sign in successfully with valid credentials', async () => {
    nock('http://localhost:3001')
      .post('/sign-in')
      .reply(200, {
        userId: '12345',
        userEmail: 'test@example.com',
        userName: 'John Doe',
        accessToken: 'valid-token',
      });

    const response = await request('http://localhost:3001')
      .post('/sign-in')
      .send({
        userEmail: 'test@example.com',
        password: 'Password123',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.keys('userId', 'userEmail', 'userName', 'accessToken');
  });
});



  //Testing for sign out
  describe('POST /sign-out', () => {
    before(() => {
    //sign-out API
      nock('http://localhost:3001')
        .post('/sign-out')
        .reply(200, { message: 'Successfully signed out' })
        .post('/sign-out')
        .reply(401, { error: 'Unauthorized' });
    });
  
    it('should sign out successfully', async () => {
      const response = await request('http://localhost:3001')
        .post('/sign-out')
        .set('Authorization', `Bearer validToken`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message', 'Successfully signed out');
    });
  
    it('should return 401 if no token is provided', async () => {
      const response = await request('http://localhost:3001').post('/sign-out');
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error', 'Unauthorized');
    });
  });
  

  
  //Testing for sign up
  describe('POST /users (Sign up)', () => {
    before(() => {
      //users API
      nock('http://localhost:3001')
        .post('/users', { userEmail: 'newuser@example.com', password: 'Password123', username: 'NewUser' })
        .reply(200, {
          userId: '12345',
          userEmail: 'newuser@example.com',
          username: 'NewUser',
          createDate: '2024-01-01T12:00:00Z',
        })
        .post('/users', { userEmail: 'test@example.com', password: 'Password123', username: 'TestUser' })
        .reply(302, { message: 'User already exists' })
        .post('/users')
        .reply(400, { error: 'Invalid payload' });
    });
  
    it('should create a user successfully', async () => {
      const response = await request('http://localhost:3001')
        .post('/users')
        .send({
          userEmail: 'newuser@example.com',
          password: 'Password123',
          username: 'NewUser',
        });
      expect(response.status).to.equal(200);
      expect(response.body).to.have.keys('userId', 'userEmail', 'username', 'createDate');
    });
  
    it('should return 302 for an already existing user', async () => {
      const response = await request('http://localhost:3001')
        .post('/users')
        .send({
          userEmail: 'test@example.com',
          password: 'Password123',
          username: 'TestUser',
        });
      expect(response.status).to.equal(302);
    });
  
    it('should return 400 for invalid request payload', async () => {
      const response = await request('http://localhost:3001').post('/users').send({});
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'Invalid payload');
    });
  });
  
  
// Test for deleting user account

describe('DELETE /api/v1/user/:id', () => {
  const baseUrl = 'http://localhost:3001';

  before(() => {
    // Mocking DELETE API for different scenarios
    nock(baseUrl)
      .delete('/api/v1/delete/12345')
      .matchHeader('Cookie', /access_token=.+/)
      .reply(200, { message: 'User deleted successfully' })

      .delete('/api/v1/delete/12345')
      .matchHeader('Cookie', 'access_token=') // Missing token
      .reply(401, { error: 'Unauthorized access. Invalid or missing token.' })

      .delete('/api/v1/delete/99999') // Non-existent user ID
      .matchHeader('Cookie', /access_token=.+/)
      .reply(404, { message: 'User not found.' });
  });

  it('should delete the user account', async () => {
    const accessToken = getAccessToken();
    const response = await request(baseUrl)
      .delete('/api/v1/delete/12345')
      .set('Cookie', `access_token=${accessToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'User deleted successfully');
  });

  it('should return 401 for unauthorized access (missing or invalid token)', async () => {
    const response = await request(baseUrl)
      .delete('/api/v1/delete/12345')
      .set('Cookie', 'access_token=');

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error', 'Unauthorized access. Invalid or missing token.');
  });

  it('should return 404 if the user does not exist', async () => {
    const accessToken = getAccessToken();
    const response = await request(baseUrl)
      .delete('/api/v1/delete/99999')
      .set('Cookie', `access_token=${accessToken}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('message', 'User not found.');
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