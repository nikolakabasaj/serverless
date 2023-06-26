import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export function createFn(api: any, fnName: string, fnEntry: string, fnProps: any) {
    return new NodejsFunction(api, fnName, {
        ...fnProps,
        entry: fnEntry,
    });
}


export function createFnProps(envProps: any) {
    return {
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        environment: envProps
    };
}
