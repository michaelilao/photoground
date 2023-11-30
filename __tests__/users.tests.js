const fs = require('fs');

const request = require('supertest');
const app = require('../app');
require('dotenv').config();

const testUser = {
  email: 'test@gmail.com',
  name: 'test',
  password: 'test12345',
}

describe('POST /api/v1/users/register', () => {
  it('should create a new user', async () => {
    const res = await request(app).post(`${process.env.API_PATH}/users/register`).send(testUser);
    const { id } = res.body.data;
    testUser.id = id;
    expect(res.statusCode).toBe(200);
    expect(id).toBe(2); // Should always be second user in the db
  });
});


describe('POST /api/v1/users/login', () => {
  it('should login to test user', async () => {
    const testLogin = {...testUser}
    delete testLogin.name
    const res = await request(app).post(`${process.env.API_PATH}/users/login`).send({
      email: testUser.email,
      password: testUser.password
    });
    const { id } = res.body.data;
    expect(res.statusCode).toBe(200);
    expect(id).toBe(testUser.id)
  });
});

afterAll(() => {
  const filePath = 'test-db.sqlite';
  fs.unlinkSync(filePath);
});
