require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  cosEnpoint: process.env.COS_ENDPOINT,
  cosApikey: process.env.COS_API_KEY,
  cosInstanceId: process.env.COS_INSTANCE_ID,
  cosAccessKey: process.env.COS_ACCESS_KEY,
  cosSecretAccess: process.env.COS_SECRET_ACCESS,
  cosSignatureVersion: process.env.COS_SIGNATURE_VERSION,
  cosIbmAuthEndpoint: process.env.COS_IBM_AUTH_ENDPOINT,
  bucketname: process.env.COS_BUCKETNAME,
  awsAccessKey:process.env.AWS_ACCESS_KEY,
  awsSecretAccess:process.env.AWS_SECRET_ACCESS,
  awsRegion: process.env.AWS_REGION,
  userTimeInactive: process.env.TIME_INACTIVE,
  secretKeyAuth: process.env.SECRET_KEY,
  URLTHANOS: process.env.API_THANOS,
  ApiKeyThanos: process.env.API_KEY_THANOS,
  HOST_SMTP: process.env.HOST_SMTP,
  PORT_SMTP: process.env.PORT_SMTP,
  SECURE_SMTP: process.env.SECURE_SMTP,
  AUTH_SMTP: process.env.AUTH_SMTP,
  PASS_SMTP: process.env.PASS_SMTP,
}

module.exports = { config };