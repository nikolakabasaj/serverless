export function httpResponse(statusCode: number, message: any, body?: any, headers?: any) {
    const resBody : any = { message: message };
    if(body) { resBody['body'] = body; }

    const res: any = {
        statusCode: statusCode,
        body: JSON.stringify(resBody),
    }
    if(headers) { res['headers'] = headers; }
    return res; 
}
