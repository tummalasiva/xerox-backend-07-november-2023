# elevate-Cloud-Storage
This package exports the methods to upload file in GCP, AWS S3, OCI and AZURE

## PreRequisite
You must have all type of required credentials of AWS/GCP/AZURE/OCI cloud storage while calling upload methods

## Installation

```
npm i elevate-cloud-storage
```

## Usage Google Cloud Storage

### To upload file

```
const { GcpFileHelper } = require('elevate-cloud-storage');
const path = require('path');

// assuming logo.png is present in your root directory
const filePath = path.join(__dirname, 'logo.png'); // Stored file path - pass absolute path.

const destFileName = 'logo.png'; // fileName to be saved in google cloud
const bucketName = '<bucket-name>'; // google cloud storage bucket in which file gets saved
const gcpProjectId = '<gcp-project-id>'; // google cloud storage project id - Get from gcp console

// assuming gcp.json is present in your root directory
// google cloud storage json configuration file - pass absolute path
// download file from manage storage api key section in gcp console
const gcpJsonFilePath = path.join(__dirname, 'gcp.json');

GcpFileHelper.uploadFile({filePath, destFileName, bucketName, gcpProjectId, gcpJsonFilePath}).then(response => {
    console.log(response);
}).catch(err => {
    console.log(error);
});
```

### To generate signed url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - location from bucket - example - users/abc.png
    bucketName: '<Bucket-Name>', // google cloud storage bucket in which action is peformed over file
    actionType: 'write', // signed url usage type - example ('read' | 'write' | 'delete' | 'resumable')
    expiry: Date.now() + 1000 * 60 * 30, // signed url expiration time - In ms from current time - type number | string | Date
    gcpProjectId: '<Gcp-Project-Id>', // google cloud storage project id
    gcpJsonFilePath: '<Gcp-Json-File-Path>', // google cloud storage json configuration file absolute path for connectivity
    contentType: 'multipart/form-data', // content type of file, example multipart/form-data, image/png, csv/text etc
};

GcpFileHelper.getSignedUrl(options).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

### To get downloadable url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - location from bucket - example - users/abc.png
    bucketName: '<Bucket-Name>', // google cloud storage bucket in which action is peformed over file
    gcpProjectId: '<Gcp-Project-Id>', // google cloud storage project id
    gcpJsonFilePath: '<Gcp-Json-File-Path>', // google cloud storage json configuration file absolute path for connectivity
};

GcpFileHelper.getDownloadableUrl(options).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

## Usage Amazon Web Service S3 storage

### To upload file

```
const { AwsFileHelper } = require('elevate-cloud-storage');

// assuming logo.png is present in your root directory
const filePath = path.join(__dirname, 'logo.png'); // Stored file path - pass absolute path.

const destFileName = 'logo.png'; // fileName to be saved in aws s3 bucket
const bucketName = '<bucket-name>'; // aws s3 bucket in which file gets saved
const accessKeyId = '<access-key-id>'; // aws s3 access key id - Get from aws console
const secretAccessKey = '<secret-access-key>' // aws s3 secret access key - Get from aws console

// aws region where bucket will be located for fastest delivery of resources - Get bucket-region from aws s3 console
const bucketRegion = '<bucket-region>'

AwsFileHelper.uploadFile({filePath, destFileName, bucketName, accessKeyId, secretAccessKey, bucketRegion}).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

### To generate signed url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - i.e location from bucket - ex - users/abc.png
    bucketName: '<Bucket-Name>', // aws s3 storage bucket in which action is peformed over file
    actionType: 'putObject', // signed url usage type - example ('putObject' | 'getObject')
    expiry: 30 * 60, // signed url expiration time - In sec - type number
    accessKeyId: '<Access-Key-Id>', // aws s3 access key id
    secretAccessKey: '<Secret-Access-Key>', // aws s3 secret access key
    bucketRegion: '<Bucket-Region>' // aws region where bucket will be located, example - 'ap-south-1'
}

AwsFileHelper.getSignedUrl(options).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
```

### To get downloadable url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - i.e location from bucket - ex - users/abc.png
    bucketName: '<Bucket-Name>', // aws s3 storage bucket in which action is peformed over file
    bucketRegion: '<Bucket-Region>' // aws region where bucket will be located, example - 'ap-south-1'
}

AwsFileHelper.getDownloadableUrl(options).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
```

## Usage Azure Storage

### To upload file

```
const { AzureFileHelper } = require('elevate-cloud-storage');

// assuming logo.png is present in your root directory
const filePath = path.join(__dirname, 'logo.png'); // Stored file path - pass absolute path.

const destFileName = 'logo.png'; // fileName to be saved in azure container
const containerName = '<container-name>'; // container in which file gets saved
const accountKey = '<account-key>' // account name of azure storage - get from storage console
const accountName = '<account-name>' // account key of azure storage - get from storage console 

AzureFileHelper.uploadFile({filePath, destFileName, containerName, accountName, accountKey}).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

### To generate signed url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - i.e location from container - ex - users/abc.png
    containerName: '<Container-Name>', // container in which file gets saved
    expiry: 30, // signed url expiration time - In minute - type number
    actionType: "w", // signed url usage type - example ('w' | 'r' | 'wr' | 'racwdl') - pair of any alphabets among racwdl
    accountName: '<Account-Name>', // account name of azure storage 
    accountKey: '<Account-Key>', // account key of azure storage 
    contentType: 'multipart/form-data' // content type of file, example multipart/form-data, image/png, csv/text etc
};

AzureFileHelper.getSignedUrl(options).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
```

### To get downloadable url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - i.e location from container - ex - users/abc.png
    containerName: '<Container-Name>', // container in which file gets saved
    expiry: 30, // signed url expiration time - In minute - type number
    actionType: "rw", // signed url usage type - example ('w' | 'r' | 'wr' | 'racwdl') - pair of any alphabets among racwdl
    accountName: '<Account-Name>', // account name of azure storage 
    accountKey: '<Account-Key>', // account key of azure storage
};

AzureFileHelper.getDownloadableUrl(options).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
```


## Usage Oracle Cloud Object Storage

### To upload file

```
const { OciFileHelper } = require('elevate-cloud-storage');

// assuming logo.png is present in your root directory
const filePath = path.join(__dirname, 'logo.png'); // Stored file path - pass absolute path.

const destFileName = 'logo.png'; // fileName to be saved in oci bucket
const bucketName = '<bucket-name>'; // oci bucket in which file gets saved
const accessKeyId = '<access-key-id>'; // oci access key id - Get from oci 
const secretAccessKey = '<secret-access-key>' // oci secret access key - Get from awoci
const endpoint = '<endpoint>' // OCI endpoint

// oci region where bucket will be located for fastest delivery of resources - Get bucket-region from oci console
const bucketRegion = '<bucket-region>'

OciFileHelper.uploadFile({filePath, destFileName, bucketName, accessKeyId, secretAccessKey, bucketRegion, endpoint}).then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});
```

### To generate signed url

```
const options = {
    destFilePath: 'users/abc.png', // Stored file path - i.e location from bucket - ex - users/abc.png
    bucketName: '<Bucket-Name>', // oci storage bucket in which action is peformed over file
    actionType: 'putObject', // signed url usage type - example ('putObject' | 'getObject')
    expiry: 30 * 60, // signed url expiration time - In sec - type number
    accessKeyId: '<Access-Key-Id>', // oci access key id
    secretAccessKey: '<Secret-Access-Key>', // oci secret access key
    bucketRegion: '<Bucket-Region>' // oci region where bucket will be located, example - 'ap-hyderabad-1'
     endpoint :  '<endpoint>' // OCI endpoint
}

OciFileHelper.getSignedUrl(options).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
```

### To get downloadable url

```
const options = {
   destFilePath: 'users/abc.png', // Stored file path - i.e location from bucket - ex - users/abc.png
    bucketName: '<Bucket-Name>', // oci storage bucket in which action is peformed over file
    actionType: 'putObject', // signed url usage type - example ('putObject' | 'getObject')
    expiry: 30 * 60, // signed url expiration time - In sec - type number
    accessKeyId: '<Access-Key-Id>', // oci access key id
    secretAccessKey: '<Secret-Access-Key>', // oci secret access key
    bucketRegion: '<Bucket-Region>' // oci region where bucket will be located, example - 'ap-hyderabad-1'
    endpoint :  '<endpoint>' // OCI endpoint
}

OciFileHelper.getDownloadableUrl(options).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
```

Thanks for using this, Looking forward to your contributions 😎 .
