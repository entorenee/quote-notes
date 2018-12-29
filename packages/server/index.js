const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const app = express();
const { AUTH0_DOMAIN } = process.env;
console.log(AUTH0_DOMAIN);

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
