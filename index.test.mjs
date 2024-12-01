import { createUser } from './models/userModel.js'
import { validateUser } from './models/authModel.js'
import {expect} from 'chai'
import fetch from 'node-fetch'; // Ensure node-fetch is up to date

const base_url = 'http://localhost:3001'

// Helper function to get access token
const getAccessToken = async () => {
  const response = await fetch(`${base_url}/api/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'login@foo.com',
      password: 'login123',
    }),
  });
  const data = await response.json();
  return `Bearer ${data.accessToken}`;
};

// Test for signup endpoint
describe('POST /api/signup', () => {
  it('should register with valid email and password', async () => {
    const email = 'login@foo.com';
    const password = 'login123';
    const username = 'loginuser';
    const created_at = new Date();
    const token = await getAccessToken();

    const response = await fetch(`${base_url}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({ email, password, username, created_at }),
    });

    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id', 'email');
  });

  it('should not post a user with less than 8 characters password', async () => {
    const email = 'register@foo.com';
    const password = 'short1';

    const response = await fetch(`${base_url}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test for login endpoint
describe('POST /api/signin', () => {
  it('should login with valid email and password', async () => {
    const email = 'login@foo.com';
    const password = 'login123';

    const response = await fetch(`${base_url}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('accessToken');
  });

  it('should not login with invalid credentials', async () => {
    const email = 'invalid@foo.com';
    const password = 'wrongpassword';

    const response = await fetch(`${base_url}/api/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(401);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

// Test for signout endpoint
describe('POST /api/signout', () => {
  it('should logout the user', async () => {
    const token = await getAccessToken();

    const response = await fetch(`${base_url}/api/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('message');
  });
});

// Test for deleting user account
describe('DELETE /api/user/:id', () => {
  it('should delete the user account', async () => {
    const token = await getAccessToken();
    const userId = 'some-valid-user-id';

    const response = await fetch(`${base_url}/api/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    });

    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('message');
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
