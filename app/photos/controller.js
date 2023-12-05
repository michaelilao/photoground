const { createPhotosDirectory } = require('./services');

const upload = async (req, res) => {
  try {
    // Check if users folder exists, if not create it
    await createPhotosDirectory(req.user.id);
    // Create a status record for the request

    // Create a photo record for each uploaded file
    // Compress photos and upload them to their user folder Async

    // Once status for all photos are done, update status to done
    return res.status(200).json({
      error: false,
      message: 'Photos uploaded Succesfully',
      status: 200,
      data: {},
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
