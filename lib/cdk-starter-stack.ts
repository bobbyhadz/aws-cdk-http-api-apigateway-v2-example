import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create our HTTP Api
    const httpApi = new HttpApi(this, 'http-api-example', {
      description: 'HTTP API example',
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    // 👇 create get-todos Lambda
    const getTodosLambda = new lambda.Function(this, 'get-todos', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/get-todos')),
    });

    // 👇 add route for GET /todos
    httpApi.addRoutes({
      path: '/todos',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'get-todos-integration',
        getTodosLambda,
      ),
    });

    // 👇 create delete-todos Lambda
    const deleteTodoLambda = new lambda.Function(this, 'delete-todo', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/delete-todo')),
    });

    // 👇 add route for DELETE /todos/{todoId}
    httpApi.addRoutes({
      path: '/todos/{todoId}',
      methods: [HttpMethod.DELETE],
      integration: new HttpLambdaIntegration(
        'delete-todo-integration',
        deleteTodoLambda,
      ),
    });

    // 👇 add an Output with the API Url
    new cdk.CfnOutput(this, 'apiUrl', {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url!,
    });
  }
}
