'use strict';

const fs = require('fs');

const S3 = require('aws-sdk/clients/s3');
const { LexRuntime } = require('aws-sdk');

module.exports = class OCIFileHelper {

    /**
       * Upload file to OCI 
       * @method
       * @name uploadFile - Required all parameters*
       * @param  {filePath} filePath - Stored file path - absolute path.
       * @param  {string} destFileName - fileName to be saved in oci bucket
       * @param  {string} bucketName - oci bucket in which file gets saved
       * @param  {string} accessKeyId - oci access key id
       * @param  {string} secretAccessKey - oci secret access key
       * @param  {string} bucketRegion - oci region where bucket will be located
       * @returns {Promise<JSON>} Uploaded json result.
       * @see accessKeyId - Get from oci console
       * @see secretAccessKey - Get from oci console
       * @see bucketRegion - Get from oci console
     */
    static async uploadFile({ filePath, destFileName, bucketName, accessKeyId, secretAccessKey, bucketRegion,endpoint }) {

        if (!filePath) {
            const error = new Error('filePath is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (typeof filePath !== 'string') {
            const error = new Error('expected filepath as string');
            error.code = 500;
            throw error;
        }

        if (!destFileName) {
            const error = new Error('destFileName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!bucketName) {
            const error = new Error('bucketName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accessKeyId) {
            const error = new Error('accessKeyId is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!secretAccessKey) {
            const error = new Error('secretAccessKey is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!bucketRegion) {
            const error = new Error('bucketRegion is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!endpoint) {
            const error = new Error('endpoint is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (typeof endpoint !== 'string') {
            const error = new Error('expected endpoint as string');
            error.code = 500;
            throw error;
        }

        /* Instantiate s3 cloud storage class */
        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            signatureVersion: 'v4',
            region: bucketRegion,
            s3ForcePathStyle: true,
            endpoint: endpoint
        });

        // Read content from the file as buffer
        const fileContent = fs.readFileSync(filePath);

        try {
            const uploadedFile = await s3.upload({
                Bucket: bucketName,
                Key: destFileName,
                Body: fileContent
            }).promise();
            return uploadedFile;
        } catch (error) {
            throw error;
        }

    }

    /**
      * Get signed url to create, read or delete objects
      * @method
      * @name getSignedUrl
      * @param  {destFilePath} destFilePath - Stored file path - i.e location from bucket - ex - users/profile.png
      * @param  {string} bucketName - oci storage bucket in which action is peformed over file
      * @param  {string} actionType - signed url usage type - example ('putObject' | 'getObject')
      * @param  {string} expiry - signed url expiration time - In sec - type number
      * @param  {string} accessKeyId - oci access key id
      * @param  {string} secretAccessKey - oci secret access key
      * @param  {string} bucketRegion - oci region where bucket will be located, ex - ap-south-1
      * @returns {Promise<JSON>} Signed url json result.
      * @see accessKeyId - Get from oci console
      * @see secretAccessKey - Get from oci console
      * @see bucketRegion - Get from oci console
    */
    static async getSignedUrl({ destFilePath, bucketName, actionType, expiry, accessKeyId, secretAccessKey, bucketRegion,endpoint }) {

        if (!destFilePath) {
            const error = new Error('destFilePath is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (typeof destFilePath !== 'string') {
            const error = new Error('expected destFilePath as string');
            error.code = 500;
            throw error;
        }

        if (!bucketName) {
            const error = new Error('bucketName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!actionType) {
            const error = new Error('actionType is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (expiry && typeof expiry !== 'number') {
            const error = new Error('expiry is invalid');
            error.code = 500;
            throw error;
        }

        if (actionType !== 'putObject' && actionType !== 'getObject') {
            const error = new Error('actionType is invalid');
            error.code = 500;
            throw error;
        }

        if (!accessKeyId) {
            const error = new Error('accessKeyId is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!secretAccessKey) {
            const error = new Error('secretAccessKey is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!bucketRegion) {
            const error = new Error('bucketRegion is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!endpoint) {
            const error = new Error('endpoint is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (typeof endpoint !== 'string') {
            const error = new Error('expected endpoint as string');
            error.code = 500;
            throw error;
        }


        /* Instantiate s3 cloud storage class */
        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            signatureVersion: 'v4',
            region: bucketRegion,
            s3ForcePathStyle: true,
            endpoint: endpoint
        });

        /* Signed url options */
        let options = {
            Bucket: bucketName,
            Key: destFilePath,
            Expires: expiry
        };

        options = JSON.parse(JSON.stringify(options));

        try {
            /* connected to bucket and instantiated file object to get signed url */
            const signedUrl = await s3.getSignedUrlPromise(actionType, options);
            return { signedUrl, filePath: destFilePath };
        } catch (error) {
            throw error;
        }

    }

    /**
     * Get downloadable url.
     * @method
     * @name getDownloadableUrl
     * @param {string} destFilePath - Stored file path - i.e location from bucket - ex - users/profile.png
     * @param {string} bucketName - oci storage bucket in which action is peformed over file
     * @param  {string} bucketRegion - oci region where bucket will be located, ex - ap-south-1
     * @returns {Promise<string>} Get downloadable url link
    */
 
    static async getDownloadableUrl({ destFilePath, bucketName,endpoint }) {

        if (!destFilePath) {
            const error = new Error('destFilePath is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!bucketName) {
            const error = new Error('bucketName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!endpoint) {
            const error = new Error('endpoint is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (typeof endpoint !== 'string') {
            const error = new Error('expected endpoint as string');
            error.code = 500;
            throw error;
        }

        try {
            let downloadableUrl = `${endpoint}/${bucketName}/${destFilePath}`;
            return { downloadableUrl, filePath: destFilePath };

        } catch (error) {
            throw error;
        }

    }

}