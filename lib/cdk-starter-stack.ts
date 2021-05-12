import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}
