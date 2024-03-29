/* eslint-disable prettier/prettier */
const Joi = require('joi');

const photosSchema = {
  photoId: 'photo_id',
  userId: 'user_id',
  name: 'name',
  photoType: 'photo_type',
  statusId: 'status_id',
  batchId: 'batch_id',
  width: 'width',
  height: 'height',
  hex: 'hex',
  dateOriginal: 'date_original',
  latitude: 'latitude',
  longitude: 'longitude',
  isFavourite: 'is_favourite'
};

const upload = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string(),
        destination: Joi.string(),
        filename: Joi.string(),
        path: Joi.string(),
        size: Joi.number(),
      }),
    )
    .required()
    .min(1),
});

const status = Joi.object({
  batchId: Joi.string().required()
});

const list = Joi.object({
  limit: Joi.number(),
  offset: Joi.number(),
  order: Joi.string(),
  sort: Joi.string()
});

const photo = Joi.object({
  photoId: Joi.string().required()
});

const save = Joi.object({
  photoId: Joi.string().required(),
  rotate: Joi.number().valid(0, 90, 180, 270, 360),
  isFavourite: Joi.boolean()
});

module.exports = { upload, status, list, photosSchema, photo, save };
