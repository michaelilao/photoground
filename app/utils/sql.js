/* eslint-disable no-useless-escape */
const { uploadStatus } = require('./enums');

exports.createStatusTable = 'CREATE TABLE status (status_id INTEGER PRIMARY KEY, status_text TEXT, CONSTRAINT status_unique UNIQUE (status_text))';

exports.insertStatusRecords = `INSERT INTO status (status_id, status_text) VALUES${Object.entries(uploadStatus)
  .map((status) => {
    const id = status[1];
    const text = status[0];
    return `(${id}, '${text}')`;
  })
  .join(', ')};`;
