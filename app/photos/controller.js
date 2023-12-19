const { createPhotosDirectory, createPhotoRecords, getPhotoBatchStatus } = require('./services');

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

module.exports = { upload, status };
