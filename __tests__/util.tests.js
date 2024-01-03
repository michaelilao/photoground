/* eslint-disable no-undef */
// Prettier doesnt recognize jest

const { formatDate, formatCoords } = require('../app/utils');

describe('test date format ', () => {
  it('should successfully convert date string to iso date string', async () => {
    const dateString = '2023:11:23 17:19:47';
    const isoDateString = formatDate(dateString);
    expect(isoDateString).toBe('2023-11-23 17:19:47.000');
  });
});

describe('test date format ', () => {
  it('should successfully convert date string to date object', async () => {
    const dateString = '2023:11:23 17:19:47';

    const isoDateString = formatDate(dateString);
    const dateObj = new Date(isoDateString);
    expect(dateObj.toString()).toBe('Thu Nov 23 2023 17:19:47 GMT-0500 (Eastern Standard Time)');
  });
});

describe('test date format ', () => {
  it('should fail converting date string to iso date string', async () => {
    const dateString = '2023:11:2317:19:47';

    const isoDateString = formatDate(dateString);
    expect(isoDateString).toBeNull();
  });
});

describe('test Latitude Longitude', () => {
  it('should convert dms to dd', async () => {
    const coords = {
      GPSLatitudeRef: 'N',
      GPSLatitude: [43, 15, 23.39],
      GPSLongitudeRef: 'W',
      GPSLongitude: [79, 52, 20.41],
    };

    const formattedCoords = formatCoords(coords.GPSLatitude, coords.GPSLatitudeRef, coords.GPSLongitude, coords.GPSLongitudeRef);
    const converted = [43.2565, -79.87234];

    expect(formattedCoords[0]).toBeCloseTo(converted[0]);
    expect(formattedCoords[1]).toBeCloseTo(converted[1]);
  });
});

describe('test Latitude Longitude', () => {
  it('should fail convert dms to dd', async () => {
    const coords = {
      GPSLatitudeRef: 'K',
      GPSLatitude: [],
      GPSLongitudeRef: 'T',
      GPSLongitude: [79, 52, 20.41],
    };

    const formattedCoords = formatCoords(coords.GPSLatitude, coords.GPSLatitudeRef, coords.GPSLongitude, coords.GPSLongitudeRef);

    expect(formattedCoords[0]).toBeNull();
    expect(formattedCoords[1]).toBeNull();
  });
});
