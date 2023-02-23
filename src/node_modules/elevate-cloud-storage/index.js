'use strict';

module.exports = {
    GcpFileHelper: require('./lib/gcp/upload'),
    AwsFileHelper: require('./lib/aws/upload'),
    AzureFileHelper: require('./lib/azure/upload'),
    OciFileHelper: require('./lib/oci/upload'),
};