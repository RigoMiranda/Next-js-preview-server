#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const env = { account: '817379289172', region: 'us-east-1' };

const app = new cdk.App();
new InfrastructureStack(app, 'InfrastructureStack', { env: env });
