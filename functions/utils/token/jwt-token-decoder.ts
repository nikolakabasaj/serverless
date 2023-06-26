export type JwtToken = { sub: string; email: string, userId: string } | null;

export function decodeToken(token: string): JwtToken  {
	try {
        const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
		return decodedToken ? createJWTToken(decodedToken) : null;
	} catch (err) {
		console.log(err);
		return null;
	}
}

function createJWTToken(decodedToken: any) : JwtToken {
    return  {
        sub: decodedToken['sub'] as string,
        email: decodedToken['email'] as string,
		userId: decodedToken['custom:userId'] as string
    };
}