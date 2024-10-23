const { config: settings } = require('../config/config');
var ibm = require('ibm-cos-sdk');

var config = {
    endpoint: settings.cosEnpoint,
    apiKeyId: settings.cosApikey,
    serviceInstanceId: settings.cosInstanceId,
    ibmAuthEndpoint: settings.cosIbmAuthEndpoint,
    accessKeyId: settings.cosAccessKey,
    secretAccessKey: settings.cosSecretAccess,
    signatureVersion: settings.cosSignatureVersion,
};

var cos = new ibm.S3(config);

module.exports = cos;