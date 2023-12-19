const { createPhotosDirectory, createPhotoRecords, getPhotoBatchStatus, getPhotoList, getPhotoFilePath } = require('./services');

const upload = async (req, res) => {
  // Check if users folder exists, if not create it and return the user
  const directoryStatus = await createPhotosDirectory(req.user.id);
  if (directoryStatus.error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }

  // Create a photo record for each uploaded file and move to user folder
  const batchId = await createPhotoRecords(req.body.files, req.user.id);
  return res.status(200).json({
    error: false,
    message: 'Photos uploaded Succesfully',
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
    message: 'Batch Status Fetched Succesfully',
    status: 200,
    data: { batchId, photos: photosStatus },
  });
};

const list = async (req, res) => {
  const { limit, offset, sort, order } = req.query;
  const photoList = await getPhotoList(req.user.id, limit, offset, sort, order);

  if (photoList.error) {
    return res.status(photoList.status).json(photoList);
  }

  return res.status(200).json({
    error: false,
    message: 'Photo list Fetched Succesfully',
    status: 200,
    data: { photos: photoList },
  });
};

const file = async (req, res) => {
  console.log(req.params);
  const photo = await getPhotoFilePath(req.user.id, req.params.photoId);
  return res.status(200).json({
    error: false,
    message: 'Photo list Fetched Succesfully',
    status: 200,
    data: { photo },
  });
};
module.exports = { upload, status, list, file };
