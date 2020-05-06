import util from 'util';

import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const getPolicyDocument = (Effect: string, Resource: string) => {
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource,
      },
    ],
  };
  return policyDocument;
};

interface Params {
  type?: string;
  authorizationToken: string;
  methodArn: string;
}

// extract and return the Bearer Token from the Lambda event parameters
const getToken = (params: Params) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`,
    );
  }
  return match[1];
};

const jwtOptions = {
  audience: process.env.TOKEN_AUDIENCE,
  issuer: process.env.TOKEN_ISSUER,
};

// @ts-ignore
export const authenticate = (params) => {
  const token = getToken(params);
  const decoded = jwt.decode(token, { complete: true });
  if (typeof decoded !== 'object' || !decoded?.header?.kid) {
    throw new Error('invalid token');
  }

  const client = jwksRsa({
    cache: true,
    jwksRequestsPerMinute: 5,
    // @ts-ignore
    jwksUri: process.env.JWKS_URI,
    rateLimit: true,
  });

  const getSigningKey = util.promisify(client.getSigningKey);
  return (
    getSigningKey(decoded.header.kid)
      // @ts-ignore
      .then((key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        return jwt.verify(token, signingKey, jwtOptions);
      })
      // @ts-ignore
      .then((verified) => ({
        principalId: verified.sub,
        policyDocument: getPolicyDocument('Allow', params.methodArn),
        context: {
          scope: verified.scope,
        },
      }))
  );
};
