import * as cdk from '@aws-cdk/core';
import { ServerApplication, ServerDeploymentGroup, InstanceTagSet} from '@aws-cdk/aws-codedeploy';
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";
import  { EC2Stack } from './ec2-stack';

/*
    Documentation:
    — https://docs.aws.amazon.com/cdk/api/latest/docs/aws-codedeploy-readme.html
*/

export class CodeDeployStack extends cdk.Stack {

    public serverDeploymentGroup: ServerDeploymentGroup;

    constructor(scope: cdk.App, id: string, stage: string, props?: cdk.StackProps) {
        super(scope, id, props);

        /* CodeDeploy Role */
        const serviceRole = new Role(this, `PreviewServerServiceRole${stage}`, {
        assumedBy: new ServicePrincipal("codedeploy.amazonaws.com"),
        roleName: `NextPreviewServerCodeDeploy-${stage}`,
        description: "This Role Allows...",
        managedPolicies: [
            ManagedPolicy.fromManagedPolicyArn(this,`PreviewServerServiceRolePolicy${stage}`, 'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole')
        ]
        });

        const application = new ServerApplication(this, `PreviewServerDeploymentGroup${stage}`, {
        applicationName: `NextPreviewServer-${stage}`
        });

        this.serverDeploymentGroup = new ServerDeploymentGroup(this, 'PreviewServerCodeDeployDeploymentGroup', {
            application: application,
            role: serviceRole,
            deploymentGroupName: 'PreviewServer',
            // adds User Data that installs the CodeDeploy agent on your auto-scaling groups hosts
            // default: true
            installAgent: true,
            // adds EC2 instances matching tags
            ec2InstanceTags: new InstanceTagSet(
                {
                    // any instance with tags satisfying
                    // key1=v1 or key1=v2 or key2 (any value) or value v3 (any key)
                    // will match this group
                    'name': ['next-preview-server'],
                    'env': [stage],
                },
            ),
            // adds on-premise instances matching tags
            onPremiseInstanceTags: new InstanceTagSet(
                // only instances with tags (key1=v1 or key1=v2) will match this set
                {
                    'name': ['next-preview-server'],
                },
                {
                    'env': [stage],
                },
            ),
            // CloudWatch alarms
            // alarms: [
            //     new cloudwatch.Alarm(/* ... */),
            // ],
            // whether to ignore failure to fetch the status of alarms from CloudWatch
            // default: false
            // ignorePollAlarmsFailure: false,
            // auto-rollback configuration
            autoRollback: {
                failedDeployment: true, // default: true
                stoppedDeployment: true, // default: false
                // deploymentInAlarm: true, // default: true if you provided any alarms, false otherwise
            }
        });
    }
}
