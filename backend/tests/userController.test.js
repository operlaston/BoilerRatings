require('dotenv').config()
const usersRouter = require('../controllers/user.controller')
const User = require('../models/user');
const mongoose = require('mongoose')
const request = require('supertest');
const app = require('../app');

// mock express
const { mockRequest, mockResponse } = require('jest-mock-req-res')

var res = mockRequest()
var req = mockResponse()


describe('User API Tests', () => {
    // Test the GET /api/users/:id endpoint
    it('should retrieve a user by ID', async () => {
        const testUserId = "67bbd097dfc497260faf1e67" //This is test@purdue.edu
        const res = await request(app).get(`/api/users/${testUserId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('username', 'a'); //test@purdue.edu username is "a"
        expect(res.body).not.toHaveProperty('email'); 
        expect(res.body).not.toHaveProperty('passwordHash');

    })
    it('Bad test', async () => {
        const badID = new mongoose.Types.ObjectId().toString();
        const res = await request(app).get(`/api/users/${badID}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    })
    afterAll(async () => {
        await mongoose.connection.close();
    });
});