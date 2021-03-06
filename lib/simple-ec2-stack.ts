import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2' // import ec2 library 
import * as iam from '@aws-cdk/aws-iam' // import iam library for permissions
import * as fs from 'fs'
require('dotenv').config()

const config = {
  env: {
    account: process.env.AWS_ACCOUNT_NUMBER,
    region: process.env.AWS_REGION
  }
}

export class SimpleEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    // its important to add our env config here otherwise CDK won't know our AWS account number
    super(scope, id, { ...props, env: config.env })

    // Get the default VPC. This is the network where your instance will be provisioned
    // All activated regions in AWS have a default vpc. 
    // You can create your own of course as well. https://aws.amazon.com/vpc/
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // Lets create a role for the instance
    // You can attach permissions to a role and determine what your
    // instance can or can not do
      const role = new iam.Role(
        this,
        'instance-role', // this is a unique id that will represent this resource in a Cloudformation template
        { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
      )

    // lets create a security group for our instance
    // A security group acts as a virtual firewall for your instance to control inbound and outbound traffic.
    const securityGroup = new ec2.SecurityGroup(
      this,
      'instance-sg',
      {
        vpc: defaultVpc,
        allowAllOutbound: true, // will let your instance send outboud traffic
        securityGroupName: 'instance-sg',
      }
    )

    // lets use the security group to allow inbound traffic on specific ports
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allows SSH access from Internet'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5901),
      'Allows HTTP access from Internet'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3389),
      'Allows HTTPS access from Internet'
    )

    // Finally lets provision our ec2 instance
    const instance_a = new ec2.Instance(this, 'ubuntu18-a', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'ubuntu18-a',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-southeast-2': 'ami-0f39d06d145e9bb63'
      }),
      userData: ec2.UserData.custom(
        fs.readFileSync('lib/user_script.sh', 'utf8'
      )),
      keyName: 'aws20200921keypair', // we will create this in the console before we deploy
    })

    // cdk lets us output prperties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new cdk.CfnOutput(this, 'ubuntu18-a-output', {
      value: instance_a.instancePublicIp
    })

    const instance_b = new ec2.Instance(this, 'ubuntu18-b', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'ubuntu18-b',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-southeast-2': 'ami-0f39d06d145e9bb63'
      }),
      userData: ec2.UserData.custom(
        fs.readFileSync('lib/user_script.sh', 'utf8'
      )),
      keyName: 'aws20200921keypair', // we will create this in the console before we deploy
    })

    // cdk lets us output prperties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new cdk.CfnOutput(this, 'ubuntu18-b-output', {
      value: instance_b.instancePublicIp
    })

    const instance_c = new ec2.Instance(this, 'ubuntu18-c', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'ubuntu18-c',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-southeast-2': 'ami-0f39d06d145e9bb63'
      }),
      userData: ec2.UserData.custom(
        fs.readFileSync('lib/user_script.sh', 'utf8'
      )),
      keyName: 'aws20200921keypair', // we will create this in the console before we deploy
    })

    // cdk lets us output prperties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new cdk.CfnOutput(this, 'ubuntu18-c-output', {
      value: instance_c.instancePublicIp
    }) 
  }
}
