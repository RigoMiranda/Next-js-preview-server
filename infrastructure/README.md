# Next.js Preview Server AWS CDK TypeScript project!

AWS CDK is been used to creates the infrastructure. Some of the resources created by the project are:
* IAM Roles & Policies
* SecurityGroup
* Application Load Balancer
* Target Group
* Auto Scaling Group
* EC2 Instances
* Code Deploy Application
* Code Deploy Deployment Groups
* CloudFront — TODO

# AWS CDK Information

* The `cdk.json` file tells the CDK Toolkit how to execute your app.
* The `./bin/infrastructure` file creates the CDK App and  import the different stack.
* In `./lib` you can find the definition of the stacks.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

# Deployment:
Before deploying the project, there are some things that needs to be changed in the stacks.
* S3 Bucket Name
    * In the file `./lib/s3-stack.ts` change the name of the S3 Bucket (the name must be unique)
    ```ls
    this.deploymentBucket = new Bucket(this, `PreviewBucket${stage}`, {
        bucketName: `{BUCKET-NAME}-${stage}`
    });
    ```
    * In the file `.github/workflow/main.yml` add the same bucket name in
    ```yml
    s3-bucket: ['{BUCKET-NAME}']
    ```

* Stage
    * The stage `(e.g dev | test | prod )` need to be set as an environment variable (default: `dev`). The stage is used in name of the Stacks and resources, please, usee a short name for the stage, sine AWS CDK limit the stacks ID to a maximum of 32 characters. If you need to use a long stage name, you may need to edit the stack and resources ID's. To change the default value go to `./bin/infrastructure.ts` in line 
    ```js
    const stage = process.env.STAGE || "dev";
    ```

Once to have done this changes and added the AWS Access and Secret Key to the repository environment variables, GitHub Actions will deploy the infrastructure automatically on every commit to the master branch.  

# TODO
* CloudFront - To add a friendly endpoint address to the server.
* Alarms - Create alarms to stop the EC2 instances (e.g stop from 20:00 to 6:00)
* Add WordPress to the infrastructure (If requested 😅)