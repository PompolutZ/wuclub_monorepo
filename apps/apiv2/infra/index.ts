import { App, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";
import "dotenv/config";

const {
  CDK_DEFAULT_ACCOUNT,
  CDK_DEFAULT_REGION,
  DATABASE_NAME,
  DB_PASSWORD,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL,
} = process.env;

const WUNDERWORLDS_API_LAMBDA = "WunderworldsApiLambda";

const dbName = DATABASE_NAME;
const dbPassword = DB_PASSWORD;
const firebaseProjectId = FIREBASE_PROJECT_ID;
const firebaseClientEmail = FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = FIREBASE_PRIVATE_KEY;
const firebaseDatabaseUrl = FIREBASE_DATABASE_URL;

class WunderworldsApiLambda extends NodejsFunction {
  constructor(scope: App | Construct, id: string) {
    super(scope, id, {
      functionName: WUNDERWORLDS_API_LAMBDA,
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/lambdas/api.ts"),
      environment: {
        DATABASE_NAME: dbName!,
        DB_PASSWORD: dbPassword!,
        FIREBASE_PROJECT_ID: firebaseProjectId!,
        FIREBASE_CLIENT_EMAIL: firebaseClientEmail!,
        FIREBASE_PRIVATE_KEY: firebasePrivateKey!,
        FIREBASE_DATABASE_URL: firebaseDatabaseUrl!,
      },
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
