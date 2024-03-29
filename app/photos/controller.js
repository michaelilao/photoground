const fs = require('fs');
const path = require('path');
const { deleteFileFlag, photoLimit } = require('../config');
// eslint-disable-next-line max-len
const { modifyPhoto, createPhotosDirectory, createPhotoRecords, getPhotoBatchStatus, getPhotoList, deletePhotoRecord, getPhotoCount } = require('./services');
const { getUserPhotoPath } = require('./utils');

const upload = async (req, res) => {
  // Check if users folder exists, if not create it and return the user
  const directoryStatus = await createPhotosDirectory(req.user.userId);
  if (directoryStatus.error) {
    return res.status(500).json({
      error: true,
      message: 'internal server error',
      status: 500,
    });
  }

  // Check is user is above photo limit
  const numPhotos = await getPhotoCount(req.user.userId);
  if (numPhotos > photoLimit) {
    return res.status(400).json({
      error: true,
      message: `you have reached your photo limit, ${numPhotos}/${photoLimit} `,
      status: 400,
    });
  }

  // Create a photo record for each uploaded file and move to user folder
  const batchId = await createPhotoRecords(req.body.files, req.user.userId);
  return res.status(200).json({
    error: false,
    message: 'photos uploaded succesfully',
    status: 200,
    data: { batchId },
  });
};

const status = async (req, res) => {
  const { batchId } = req.query;
  const photosStatus = await getPhotoBatchStatus(batchId);
  if (photosStatus.error) {
    return res.status(photosStatus.status).json(photosStatus);
  }

  return res.status(200).json({
    error: false,
    message: 'bacth status fetched successfully',
    status: 200,
    data: { batchId, photos: photosStatus },
  });
};

const list = async (req, res) => {
  const { limit, offset, sort, order } = req.query;
  const photoList = await getPhotoList(req.user.userId, limit, offset, sort, order);

  if (photoList.error) {
    return res.status(photoList.status).json(photoList);
  }

  return res.status(200).json({
    error: false,
    message: 'photo list fetched successfully',
    status: 200,
    data: { photos: photoList },
  });
};

const file = async (req, res) => {
  const photoPath = `${getUserPhotoPath(req.user.userId)}/${req.params.photoId}`;
  const options = {
    root: path.join(__dirname, '..', '..'),
  };
  return res.sendFile(photoPath, options);
};

const remove = async (req, res) => {
  const { photoId } = req.params;
  const deleteRecord = await deletePhotoRecord(req.user.userId, photoId);

  if (deleteRecord.error) {
    return res.status(deleteRecord.status).json({
      error: true,
      message: deleteRecord.message,
      status: deleteRecord.status,
    });
  }

  const photoPath = `${getUserPhotoPath(req.user.userId)}/${photoId}`;

  // Flag to delete from file system
  if (deleteFileFlag) {
    fs.rm(photoPath, (err) => {
      if (err) console.error(err);
    });
  }

  return res.status(200).json({
    error: false,
    message: 'photo delete succesfully',
    status: 200,
  });
};

const save = async (req, res) => {
  const { photoId, rotate, isFavourite } = req.body;
  const modifiedPhoto = await modifyPhoto(req.user.userId, photoId, { rotate, isFavourite });

  if (modifiedPhoto.error) {
    return res.status(modifiedPhoto.status).json({
      error: true,
      message: modifiedPhoto.message,
      status: modifiedPhoto.status,
    });
  }

  return res.status(200).json({
    error: false,
    message: 'photo updated successfully',
    status: 200,
    data: { photoId, rotate },
  });
};

module.exports = {
  upload,
  status,
  list,
  file,
  remove,
  save,
};
