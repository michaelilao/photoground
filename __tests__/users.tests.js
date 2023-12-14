/* eslint-disable no-undef */
// Prettier doesnt recognize jest
const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const db = require('../app/database');
const { dbPath, logPath } = require('../app/config');

const testUser = {
  email: 'test@gmail.com',
  name: 'test',
  password: 'test12345',
};

describe('POST /api/v1/users/register', () => {
  it('should create a new user', async () => {
    const res = await request(app).post(`${process.env.API_PATH}/users/register`).send(testUser);
    expect(res.statusCode).toBe(200);
    const { userId } = res.body.data;
    testUser.userId = userId;
  });
});

describe('POST /api/v1/users/register', () => {
  it('should fail to create a user that email already exists', async () => {
    const res = await request(app).post(`${process.env.API_PATH}/users/register`).send({
      email: 'test@gmail.com',
      name: 'test2',
      password: 'test12345',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/v1/users/login', () => {
  it('should login to test user', async () => {
    const res = await request(app).post(`${process.env.API_PATH}/users/login`).send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    const { userId } = res.body.data;
    expect(userId).toBe(testUser.userId);
  });
});

afterAll(async () => {
  const connection = await db();
  connection.close();
  fs.unlinkSync(dbPath);

  const filesPath = `./${process.env.NODE_ENV}-files`;
  fs.rmSync(filesPath, { recursive: true, force: true });
  fs.rmSync(logPath, { recursive: true, force: true });
});
