/* eslint-disable no-undef */
// Prettier doesnt recognize jest
const fs = require('fs');
const crypto = require('crypto');
const db = require('../app/database');
const config = require('../app/config');
const { createPhotosDirectory, getUserPhotoPath, createPhotoRecords, getPhotoBatchStatus, getPhotoList, getPhotoFilePath } = require('../app/photos/services');
const { loginUser } = require('../app/users/services');
const { ensureExists } = require('../app/utils');

// Globals
let testUser;
let connection;
let batchId;
const photoFileName = crypto.randomUUID();
const testFile = {
  fieldname: 'files[]',
  originalname: 'testFile.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: config.rawPath,
  filename: photoFileName,
  path: `${config.rawPath}/${photoFileName}`,
  size: 163513,
};
let photo;

beforeAll(async () => {
  // ensure db is started
  connection = await db();
  const user = await loginUser(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  testUser = user;

  // ensure files directory
  ensureExists(config.photoPath, (err) => {
    if (err) {
      console.error('Error occured during photo directory creation', err);
    }
  });
  ensureExists(config.rawPath, (err) => {
    if (err) {
      console.error('Error occured during photo directory creation', err);
    }
  });
});

// Testing individual services
describe('create photo directory ', () => {
  it('should create a photo directroy with the admin user id', async () => {
    const directoryStatus = await createPhotosDirectory(testUser.user.userId);
    const directoryPath = getUserPhotoPath(testUser.user.userId);
    expect(directoryStatus.error).toBe(false);
    expect(fs.existsSync(directoryPath)).toBe(true);
  });
});

describe('create photo batch ', () => {
  it('should create photo records in db and return a batch id of the job', async () => {
    await fs.appendFileSync(testFile.path, 'some jpg data');
    batchId = await createPhotoRecords([testFile], testUser.user.userId);
    expect(batchId.length).toBeGreaterThan(0);
  });
});

describe('get photo batch status', () => {
  it('should get photo batch status', async () => {
    const batch = await getPhotoBatchStatus(batchId);
    const photoRecord = batch[0];
    expect(photoRecord.status).toMatch(/^(complete|pending)$/);
    expect(photoRecord.name).toBe(testFile.originalname);

    if (photoRecord.status === 'complete') {
      const completedPhotoPath = `${getUserPhotoPath(testUser.user.userId)}/${photoFileName}`;
      expect(fs.existsSync(completedPhotoPath)).toBe(true);
    }
  });
});

describe('get photo list', () => {
  it('should get all user photos', async () => {
    const photos = await getPhotoList(testUser.user.userId);
    [photo] = photos;
    expect(photo.name).toBe(testFile.originalname);
  });
});

describe('get photo path', () => {
  it('should get photo path by id', async () => {
    const path = await getPhotoFilePath(testUser.user.userId, photo.photoId);
    expect(path.path).toBe(`${getUserPhotoPath(testUser.user.userId)}/${testFile.filename}`);
    expect(path.filename).toBe(testFile.originalname);
  });
});

afterAll(async () => {
  // Close db connections and delete db
  connection.close();
  fs.rmSync(config.dbPath);

  // Delete folders and files created
  const filesPath = `./${process.env.NODE_ENV}-files`;
  fs.rmSync(filesPath, { recursive: true, force: true });
  fs.rmSync(config.logPath, { recursive: true, force: true });
});
