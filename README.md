# Next.js Preview Server
This project provides the AWS infrastructure to deploy a Next.js project and expose a server running Next.js Preview Mode. 
## Infrastructure: 
AWS CDK is been used to creates the infrastructure. Some of the resources created by the project are:
* IAM Roles & Policies
* SecurityGroup
* Application Load Balancer
* Target Group
* Auto Scaling Group
* EC2 Instances
* Code Deploy Application
* Code Deploy Deployment Groups

## Next.js Headless WordPress (WP) Template:
To use this service with Headless WP, you can start with the startup template `cms-wordpress` from [Vercel/Next.js](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress). **If the Next.js server is going to be running in the same environment/endpoint as WordPress, then follow the template instructions.**

### Using Next.js Preview Mode outside WordPress Environment
To point the WP Preview to Next.js server, we will need to modify/hack the `WP Preview Button` behavior using WP `'previewpostlink' hook`.

#### WP Hook
Add the filter below in the `wordpress/wp-content/themes/templateName/functions.php`
```php
add_filter('preview_post_link', function ($link) {
	global $post;
	$post_ID = $post->post_parent;        
    return 'http://localhost:3000/api/'
		. 'preview?id='
		. $post_slug . '&wpnonce='
		. wp_create_nonce('wp_rest');
});
```

## CI/CD:
Automating the infrastructure deployment.

### Requirement:
For any CI/CD you will need to provide environment variables with the `AWS Credentials` of a user with `Admin Permissions`. The following variables are:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY

### GitHub Action
In the file `.github/workflows/main.yml` you will find the code to

---
### CircleCI
*— TODO —*

# Resources:
* [AWS CDK TypeScript](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
* [Create CI/CD with Github Actions + AWS EC2, CodeDeploy and S3](https://medium.com/codemonday/github-actions-for-ci-cd-with-ec2-codedeploy-and-s3-e93e75bf1ce0)
* [Vercel/Next.js](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress)
* [Preview in Headless Wordpress](https://www.tonyle.dev/headless-wordpress-preview/)
