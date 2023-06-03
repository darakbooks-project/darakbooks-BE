import Joi from '@hapi/joi';

export default {
  app: {
    port: Joi.number().default(3000),
    environment: Joi.string().valid('development', 'production').default('development'),
  },
  db: {
    host: Joi.string().required(),
    port: Joi.number().default(3306),
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  },
  jwt: {
    jwtAccessSecret: Joi.string().required(),
    accessExpiresInHour: Joi.number().default(6),
    accessExpiresInSec: Joi.number().default(30),
    jwtRefreshSecret: Joi.string().required(),
    refreshExpiresInDay: Joi.number().default(60),
  },
  kakao: {
    clientSecret: Joi.string().required(),
    clientId: Joi.string().required(),
    callbackURL: Joi.string().required(),
  },
  s3: {
    accessKey: Joi.string().required(),
    secretKey: Joi.string().required(),
    bucket: Joi.string().required(),
  },
  cache: {
    host: Joi.string().required(),
    port: Joi.string().required(),
    password: Joi.string().required(),
    ttls: Joi.number().required(),
  },
  redis: {
    ttls: Joi.number().required(),
  },
};