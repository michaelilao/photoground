const { createPhotosDirectory, createPhotoRecords } = require('./services');

const upload = async (req, res) => {
  try {
    // Check if users folder exists, if not create it and return the user
    const directoryStatus = await createPhotosDirectory(req.user.id);
    if (directoryStatus.error) {
      return res.status(500).json({
        error: true,
        message: 'Internal Server Error',
        status: 500,
      });
    }

    // Create a status record for the request TODO to optimize

    // Create a photo record for each uploaded file
    const batchId = await createPhotoRecords(req.body.files, req.user.id);

    // Once status for all photos are done, update status to done
    return res.status(200).json({
      error: false,
      message: 'Photos uploaded Succesfully',
      status: 200,
      data: { batchId },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};
module.exports = { upload };
