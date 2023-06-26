import { decodeToken } from "./token/jwt-token-decoder";

export function getAuthorizedUserId(event: any={}) {
    const decodedToken = decodeToken(event.headers.Authorization);
    return decodedToken!.userId;
}

export function getPathParameter(event: any={}, pathParameter: string) {
    return event.pathParameters[pathParameter];
}

