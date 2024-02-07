import session from 'express-session';
import express, { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { RegisterRoutes } from '../routes/routes';
import morgan from 'morgan';
import passport, { AuthenticateOptions } from 'passport';
import { VerifyCallback } from 'passport-spotify';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const path = require('path');
const buildPath = path.join(__dirname, '../../../../frontend/build');
const SpotifyStrategy = require('passport-spotify').Strategy;

// Load environment variables
dotenv.config({ path: '.env' });
const { CLIENT_ID, CLIENT_SECRET } = process.env;

// Augment express-session with a custom SessionData object

export interface accessToken {
  accessToken: number;
}

export interface tokenDate {
  tokenDate: number;
}

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: {
        accessToken: string;
        date: number;
        refresh_token: string;
      };
    };
  }
}

// Passport Setup
const authCallbackPath = '/callback';

passport.serializeUser((user: object, done: VerifyCallback) => {
  done(null, user);
});

passport.deserializeUser((obj: object, done: VerifyCallback) => {
  done(null, obj);
});

// Express app setup

export const server = express();

server.use(express.static(buildPath));
server.use(cookieParser('abcdefg'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(
  session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 }, // set the session cookie to expire after 24 hours
  }),
);
server.use(passport.initialize());
server.use(passport.session());
server.use(morgan('combined'));
server.use(
  cors({
    credentials: true, // This is important.
    origin: 'http://localhost:3000',
  }),
);

passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: `http://localhost:3005${authCallbackPath}`,
    },
    (
      accessToken: accessToken,
      refresh_token: string,
      _expires_in: number,
      done: VerifyCallback,
    ) => {
      process.nextTick(function () {
        const tokenDate = Date.now();
        done(null, {
          accessToken,
          date: tokenDate,
          refresh_token,
        });
      });
    },
  ),
);

// Use build file

// Passport endpoints
const authenticateOptions: AuthenticateOptions = {
  scope: ['playlist-read-private'],
};

// error handling middleware
server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send(err.message);
});

server.get('/passport', passport.authenticate('spotify', authenticateOptions));
server.get(
  authCallbackPath,
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  async (_req: Request, res: Response) => {
    res.redirect('/token');
  },
);

server.get(
  '/refresh',
  passport.session(),
  async (_req: Request, res: Response) => {
    res.redirect('/refreshtoken');
  },
);

server.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.sendFile(path.join(buildPath, '/index.html'), function (err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  } catch (err) {
    next(err);
  }
});

server.get(
  '/privacy',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendFile(path.join(buildPath, '/index.html'), function (err) {
        if (err) {
          res.status(500).send(err);
        }
      });
    } catch (err) {
      next(err);
    }
  },
);

// Swagger documentation endpoint
server.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../../swagger.json')));
});
RegisterRoutes(server);

server.use(function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});
