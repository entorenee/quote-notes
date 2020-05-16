import util from 'util';

import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

type PolicyEffect = 'Allow' | 'Deny'

interface PolicyDocument {
  Version: string
  Statement: {
    Action: string
    Effect: PolicyEffect
    Resource: string
  }[]
}

interface AuthenticatedResponse {
  principalId: string;
  policyDocument: PolicyDocument;
  context: {
    scope: string;
  };
}

const getPolicyDocument = (Effect: PolicyEffect, Resource: string): PolicyDocument => {
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
const getToken = (params: Params): string => {
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

export const authenticate = (params: Params): Promise<AuthenticatedResponse> => {
  const { JWKS_URI } = process.env;
  if (!JWKS_URI) {
    throw new Error('You must supply a JWKS_URI environment variable')
  }

  const token = getToken(params);
  const decoded = jwt.decode(token, { complete: true });
  if (typeof decoded !== 'object' || !decoded?.header?.kid) {
    throw new Error('invalid token');
  }

  const client = jwksRsa({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: JWKS_URI,
    rateLimit: true,
  });

  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  const getSigningKey = util.promisify(client.getSigningKey);
  return (
    getSigningKey(decoded.header.kid)
      .then((key) => {
        // @ts-ignore
        const signingKey = key.publicKey || key.rsaPublicKey;
        return jwt.verify(token, signingKey, jwtOptions);
      })
      .then((verified): AuthenticatedResponse => ({
        // @ts-ignore
        principalId: verified.sub,
        policyDocument: getPolicyDocument('Allow', params.methodArn),
        context: {
          // @ts-ignore
          scope: verified.scope,
        },
      }))
  );
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
};
