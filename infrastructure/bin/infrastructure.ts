#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CodeDeployStack } from '../lib/codeDeploy';
import { EC2Stack } from '../lib/ec2-stack';

const stage   = process.env.STAGE || "development";
const env     = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1",
};

const app               = new cdk.App();
const ec2Stack          = new EC2Stack(app, `PreviewServerEC2Stack${stage}`, stage, { env: env });
const codeDeployStack   = new CodeDeployStack(app, `PreviewServerCodeDeployStack${stage}`, stage, { env: env });

/*  Adding Resources/Dependencies */
codeDeployStack.serverDeploymentGroup.addAutoScalingGroup(ec2Stack.ec2AutoScalingGroup);
