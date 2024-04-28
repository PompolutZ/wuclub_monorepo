import { App, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";

const { CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION } = process.env;
const WUNDERWORLDS_API_LAMBDA = "WunderworldsApiLambda";

class WunderworldsApiLambda extends NodejsFunction {
  constructor(scope: App | Construct, id: string) {
    super(scope, id, {
      functionName: WUNDERWORLDS_API_LAMBDA,
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/index.ts"),
    });
  }
}

class WunderworldsBackendStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new WunderworldsApiLambda(this, WUNDERWORLDS_API_LAMBDA);
  }
}

const app = new App();
new WunderworldsBackendStack(app, "WunderworldsBackendStack", {
  env: { region: CDK_DEFAULT_REGION, account: CDK_DEFAULT_ACCOUNT },
});

app.synth();
