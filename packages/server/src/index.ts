import express from 'express'
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
require('dotenv').config();

const app = express();
const { AUTH0_DOMAIN } = process.env;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

app.get('/', checkJwt, (req, res) => {
  console.log(req.user);
  res.send('Hello World');
});

app.listen(3000);
