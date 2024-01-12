/* eslint-disable no-undef */
// Prettier doesnt recognize jest
const fs = require('fs');
const crypto = require('crypto');
const db = require('../app/database');
const config = require('../app/config');
const services = require('../app/photos/services');
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
  ensureExists(config.photoPath);
  ensureExists(config.rawPath);
});

// Testing individual services
describe('create photo directory ', () => {
  it('should create a photo directroy with the admin user id', async () => {
    const directoryStatus = await services.createPhotosDirectory(testUser.user.userId);
    const directoryPath = services.getUserPhotoPath(testUser.user.userId);
    expect(directoryStatus.error).toBe(false);
    expect(fs.existsSync(directoryPath)).toBe(true);
  });
});

describe('create photo batch ', () => {
  it('should create photo records in db and return a batch id of the job', async () => {
    await fs.copyFileSync('./public/images/default1.jpg', testFile.path);
    batchId = await services.createPhotoRecords([testFile], testUser.user.userId);
    expect(batchId.length).toBeGreaterThan(0);
  });
});

describe('get photo batch status', () => {
  it('should get photo batch status', async () => {
    const batch = await services.getPhotoBatchStatus(batchId);
    const photoRecord = batch[0];
    expect(photoRecord.status).toMatch(/^(complete|pending)$/);
    expect(photoRecord.name).toBe(testFile.originalname);
    if (photoRecord.status === 'complete') {
      const completedPhotoPath = `${services.getUserPhotoPath(testUser.user.userId)}/${photoRecord.photoId}`;
      expect(fs.existsSync(completedPhotoPath)).toBe(true);
    }
  });
});

describe('get photo list', () => {
  it('should get all user photos', async () => {
    // Sleep for 1s so backend can process batch
    await new Promise((r) => {
      setTimeout(r, 1000);
    });
    const photos = await services.getPhotoList(testUser.user.userId);
    // eslint-disable-next-line prefer-destructuring
    photo = photos[0];
    expect(photo.name).toBe(testFile.originalname);
  });
});

describe('delete photo', () => {
  it('should delete photo', async () => {
    const deleteStatus = await services.deletePhotoRecord(testUser.user.userId, photo.photoId);
    expect(deleteStatus.error).toBe(false);
  });
});

describe('delete photo doesnt exist', () => {
  it('should fail deleting photo', async () => {
    const deleteStatus = await services.deletePhotoRecord(testUser.user.userId, photo.photoId);
    expect(deleteStatus.error).toBe(true);
    expect(deleteStatus.status).toBe(404);
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
