import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

/*
    Documentation:
    — https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html
*/

export class S3Stack extends cdk.Stack {

    public deploymentBucket: Bucket;

    constructor(scope: cdk.App, id: string, stage: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.deploymentBucket = new Bucket(this, `PreviewBucket${stage}`, {
            bucketName: `next-js-preview-server-${stage}` // Bucket nam must be unique.
        });
    }

}