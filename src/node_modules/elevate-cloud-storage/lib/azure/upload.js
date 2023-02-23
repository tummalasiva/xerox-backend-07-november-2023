'use strict';

const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require('@azure/storage-blob');

module.exports = class AzureFileHelper {

    /**
       * Upload file to AWS 
       * @method
       * @name uploadFile - Required all parameters*
       * @param  {filePath} filePath - Stored file path - absolute path.
       * @param  {string} destFileName - fileName to be saved in azure container
       * @param  {string} containerName - container in which file gets saved
       * @param  {string} accountName - account name of azure storage 
       * @param  {string} accountKey - account key of azure storage 
       * @returns {Promise<JSON>} Uploaded json result.
       * @see accountName - Get from azure storage console
       * @see accountKey - Get from azure storage console
     */
    static async uploadFile({filePath, destFileName, containerName, accountName, accountKey}) {

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

        if (!containerName) {
            const error = new Error('containerName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountName) {
            const error = new Error('accountName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountKey) {
            const error = new Error('accountKey is not passed in parameter');
            error.code = 500;
            throw error;
        }

        /* Instantiate storage credentials */
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = new BlobServiceClient( // The storage account used via blobServiceClient
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = destFileName;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
            uploadBlobResponse.accessUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${destFileName}`;
            uploadBlobResponse.containerName = containerName;
            uploadBlobResponse.accountName = accountName;
            return uploadBlobResponse;
        } catch (error) {
            throw error;
        }

    }

    /**
      * Get signed url to create, read or delete objects
      * @method
      * @name getSignedUrl
      * @param  {destFilePath} destFilePath - Stored file path - i.e location from container - ex - users/profile.png
      * @param  {string} containerName - container in which file gets saved
      * @param  {string} expiry - signed url expiration time - In minute - type number
      * @param  {string} actionType - signed url usage type - example ('w' | 'r' | 'wr' | 'racwdl') - pair of any alphabets among racwdl
      * @param  {string} accountName - account name of azure storage 
      * @param  {string} accountKey - account key of azure storage 
      * @param  {string} contentType - content type of file
      * @returns {Promise<JSON>} Signed url json result.
      * @see accountName - Get from azure storage console
      * @see accountKey - Get from azure storage console
    */
    static async getSignedUrl({destFilePath, containerName, expiry, actionType, accountName, accountKey, contentType}) {

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

        if (!containerName) {
            const error = new Error('containerName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (expiry && typeof expiry !== 'number') {
            const error = new Error('expiry is invalid');
            error.code = 500;
            throw error;
        }

        if (!actionType) {
            const error = new Error('actionType is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountName) {
            const error = new Error('accountName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountKey) {
            const error = new Error('accountKey is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!contentType) {
            const error = new Error('contentType is not passed in parameter');
            error.code = 500;
            throw error;
        }

        /* Instantiate storage credentials */
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = new BlobServiceClient( // The storage account used via blobServiceClient
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const startDate = new Date();

        const expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + (expiry ? expiry : 0));

        /* Blob SAS Signature options */
        let options = {
            containerName: containerName,
            blobName: destFilePath,
            contentType
        };

        options = JSON.parse(JSON.stringify(options));
        options.permissions = BlobSASPermissions.parse(actionType); // can not be parsed
        options.startsOn = startDate; // can not be parsed
        expiry ? options.expiresOn = expiryDate : null; // can not be parsed

        const sasToken = generateBlobSASQueryParameters(options, sharedKeyCredential).toString();

        const signedUrl = containerClient.url + "/" + destFilePath + "?" + sasToken;

        return { signedUrl , filePath: destFilePath };
    }

    /**
      * Get downloadable url of uploaded object
      * @method
      * @name getDownloadableUrl
      * @param  {destFilePath} destFilePath - Stored file path - i.e location from container - ex - users/profile.png
      * @param  {string} containerName - container in which file gets saved
      * @param  {string} expiry - signed url expiration time - In minute - type number - default 30 min
      * @param  {string} actionType - signed url usage type - example ('w' | 'r' | 'wr' | 'racwdl') - pair of any alphabets among racwdl
      * @param  {string} accountName - account name of azure storage 
      * @param  {string} accountKey - account key of azure storage 
      * @returns {Promise<string>} Downloadable url
      * @see accountName - Get from azure storage console
      * @see accountKey - Get from azure storage console
    */
     static async getDownloadableUrl({destFilePath, containerName, expiry = 30, actionType, accountName, accountKey}) {

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

        if (!containerName) {
            const error = new Error('containerName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (expiry && typeof expiry !== 'number') {
            const error = new Error('expiry is invalid');
            error.code = 500;
            throw error;
        }

        if (!actionType) {
            const error = new Error('actionType is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountName) {
            const error = new Error('accountName is not passed in parameter');
            error.code = 500;
            throw error;
        }

        if (!accountKey) {
            const error = new Error('accountKey is not passed in parameter');
            error.code = 500;
            throw error;
        }

        /* Instantiate storage credentials */
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = new BlobServiceClient( // The storage account used via blobServiceClient
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const startDate = new Date();

        const expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + expiry);

        /* Blob SAS Signature options */
        let options = {
            containerName: containerName,
            blobName: destFilePath,
            permissions: BlobSASPermissions.parse(actionType),
            startsOn: startDate,
            expiresOn: expiryDate
        };

        const sasToken = generateBlobSASQueryParameters(options, sharedKeyCredential).toString();

        return containerClient.url + "/" + destFilePath + "?" + sasToken;
    }

}