/* eslint-disable no-useless-escape */
const { uploadStatus } = require('./enums');

exports.createStatusTable = 'CREATE TABLE status (status_id INTEGER PRIMARY KEY, status text, error text)';

exports.insertStatusRecords = `INSERT INTO status (status_id, status) VALUES${Object.entries(uploadStatus)
  .map((status) => {
    const id = status[1];
    const text = status[0];
    return `(${id}, '${text}')`;
  })
  .join(', ')};`;
