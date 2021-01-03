#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CodeDeployStack } from '../lib/codeDeploy';
import { EC2Stack } from '../lib/ec2-stack';

const env = { 
    account: '817379289172', 
    region: 'us-east-1'
};

const stage             = 'dev'; // 'dev | test | prod | etc.'
const app               = new cdk.App();
const ec2Stack          = new EC2Stack(app, 'PreviewServerEC2Stack', stage, { env: env });
const codeDeployStack   = new CodeDeployStack(app, 'PreviewServerCodeDeployStack', stage, { env: env });

/*  Adding Resources/Dependencies */
codeDeployStack.serverDeploymentGroup.addAutoScalingGroup(ec2Stack.ec2AutoScalingGroup);
