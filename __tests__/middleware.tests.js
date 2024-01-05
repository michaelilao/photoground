/* eslint-disable no-undef */
// Prettier doesnt recognize jest
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const { authenticate } = require('../app/middleware/auth');
const { formatBody } = require('../app/middleware/format');

beforeAll(async () => {});

describe('test auth middleware ', () => {
  it('should successfully authenticate', async () => {
    const tokenKey = process.env.TOKEN_KEY;
    const userId = 'test-id';
    const email = 'test-email';

    const token = jwt.sign({ userId, email }, tokenKey, {
      expiresIn: config.tokenAge,
    });
    const req = {
      cookies: {
        jwt: token,
      },
    };
    const next = () => true;
    const testAuth = authenticate(req, null, next);

    expect(testAuth).toBe(true);
    expect(req.user.userId).toBe(userId);
    expect(req.user.email).toBe(email);
  });
});

describe('test auth middleware ', () => {
  it('should fail authenticating', async () => {
    const tokenKey = process.env.TOKEN_KEY;
    const id = 'test-id';
    const email = 'test-email';

    const token = jwt.sign({ id, email }, tokenKey, {
      expiresIn: 0,
    });
    const req = {
      cookies: {
        jwt: token,
      },
    };
    const res = {
      status: () => ({
        json: (data) => data,
      }),
    };
    const next = () => true;
    const testAuth = authenticate(req, res, next);
    expect(testAuth.error).toBe(true);
    expect(testAuth.status).toBe(401);
    expect(testAuth.message).toBe('Invalid Token');
  });
});

describe('test format middleware ', () => {
  it('should move files to the body', async () => {
    const req = {
      body: {},
      files: [],
    };
    const next = () => true;
    const testFormat = formatBody(req, null, next);
    expect(req.body.files).toStrictEqual([]);
    expect(testFormat).toBe(true);
  });
});
