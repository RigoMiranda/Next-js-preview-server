import * as cdk from '@aws-cdk/core';
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";
import { 
    Vpc, 
    SecurityGroup, 
    Peer, 
    Port, 
    InstanceType, 
    InstanceClass, 
    InstanceSize, 
    AmazonLinuxImage,
    SubnetType,
} from "@aws-cdk/aws-ec2";
import { AutoScalingGroup } from "@aws-cdk/aws-autoscaling";
import { ApplicationTargetGroup, ApplicationProtocol, TargetType, ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";

/*
    Documentation:
    — https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html
    - https://docs.aws.amazon.com/cdk/api/latest/docs/aws-autoscaling-readme.html
*/

export class EC2Stack extends cdk.Stack {

    public ec2AutoScalingGroup: AutoScalingGroup;

    constructor(scope: cdk.App, id: string, stage: string, props?: cdk.StackProps) {
        super(scope, id, props);

        /* CodeDeploy Role */
        const serviceRole = new Role(this, `PreviewServerEC2SRole${stage}`, {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
            roleName: `NextPreviewServerEC2-${stage}`,
            description: "This Role Allows...",
            managedPolicies: [
                ManagedPolicy.fromManagedPolicyArn(this,`PreviewServerRoleForAWSCodeDeploy${stage}`, 'arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforAWSCodeDeploy'),
                ManagedPolicy.fromManagedPolicyArn(this,`PreviewServerAutoScaling${stage}`, 'arn:aws:iam::aws:policy/service-role/AutoScalingNotificationAccessRole')
            ]
        });

        /* 
            This imports the default VPC but you can also
            specify a 'vpcName' or 'tags'. 
        */
        const vpc = Vpc.fromLookup(this, 'PreviewServerDefaultVPC', {
            isDefault: true,
        });

        /* Security Group */
        const ec2SecurityGroup = new SecurityGroup(this, `PreviewServerEC2SecurityGroup${stage}`, {
            vpc: vpc,
            description: "Allows HTTP/HTTPS access to EC2 Instance",
            allowAllOutbound: true
        });

        ec2SecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
        ec2SecurityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(443));
        ec2SecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3000));
        ec2SecurityGroup.addIngressRule(Peer.anyIpv6(), Port.tcp(3000));

        /* Application Target Group */
        const appTargetGroup = new ApplicationTargetGroup(this, `PreviewServerAppTargetGroup${stage}`, {
            protocol: ApplicationProtocol.HTTP,
            port: 3000,
            vpc: vpc,
            targetType: TargetType.INSTANCE,
            targetGroupName: `PreviewServerAppTargetGroup-${stage}`,
            deregistrationDelay: cdk.Duration.seconds(120),
            healthCheck: {
                healthyHttpCodes: '200',
                path: '/'
            }
        });

        /* Application Load Balancer */
        const appLoadBalancer = new ApplicationLoadBalancer(this, `PreviewServerAppLoadBalancer-${stage}`, {
            loadBalancerName: `PreviewServerAppLoadBalancer-${stage}`,
            vpc: vpc,
            securityGroup: ec2SecurityGroup,
            internetFacing: true,
            vpcSubnets: {
                onePerAz: true,
                subnetType: SubnetType.PUBLIC
            }
        });

        /* 3000 is the default Port on Next.js  */
        appLoadBalancer.addListener('Next.js', {
            port: 3000,
            protocol: ApplicationProtocol.HTTP,
            open: true,
            defaultTargetGroups: [appTargetGroup]
        });


        const ec2UserDataCommands = `
            #!/bin/bash
            sudo yum update -y
            sudo yum install ruby wget -y
            cd /home/ec2-user
            wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
            chmod +x ./install
            sudo ./install auto
        `;

        this.ec2AutoScalingGroup = new AutoScalingGroup(this, `PreviewServerAutoScalingGroup${stage}`, {
            autoScalingGroupName: `Next.js Preview Server ${stage}`,
            vpc: vpc,
            instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
            machineImage: new AmazonLinuxImage(),
            securityGroup: ec2SecurityGroup,
            minCapacity: 1,
            desiredCapacity: 1,
            maxCapacity: 2,
            allowAllOutbound: true,
            role: serviceRole,
            keyName: 'next-preview-server', // Manually Created
        });
        this.ec2AutoScalingGroup.attachToApplicationTargetGroup(appTargetGroup);
        this.ec2AutoScalingGroup.addUserData(ec2UserDataCommands);

        cdk.Tags.of(this.ec2AutoScalingGroup).add('name', 'next-preview-server', {
            applyToLaunchedInstances: true
        });
        cdk.Tags.of(this.ec2AutoScalingGroup).add('env', stage, {
            applyToLaunchedInstances: true
        });
    }
}
