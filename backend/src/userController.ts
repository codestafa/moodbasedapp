import { Controller, Route, Request, Get } from 'tsoa';
import express from 'express';
import * as dotenv from 'dotenv';
import { fetchSpotify } from './utils/fetchSpotify';
dotenv.config({ path: '.env' });
const { CLIENT_ID, CLIENT_SECRET } = process.env;

export interface LoginRequestBody {
  code: string;
}

export interface PassportResponse {
  accessToken: string;
}

interface User {
  accessToken: string;
  refresh_token: string;
}

export interface LoginResponse {
  /** The token used to access the Spotify Web API */
  access_token: string;
  /** The type of token which is of type bearer */
  token_type: string;
  /** The time after which the access token expires */
  expires_in: number;
  scope: string;
  grant_type: string;
}

@Route('')
export class UserController extends Controller {
  @Get('token') //specify the request type
  public async accessToken(@Request() req: express.Request): Promise<void> {
    try {
      let accessToken;

      const userRequest = req.user as User;
      const tokenCookie = req.cookies.accessToken;

      if (userRequest) {
        accessToken = userRequest.accessToken;
      }

      if (tokenCookie) {
        accessToken = tokenCookie;
      }

      if (accessToken && req.session.passport?.user.date) {
        const tokenDate = Date.now();

        req.res
          ?.setHeader('set-cookie', [
            `accessToken=${accessToken}; Max-Age=86400`,
            `date=${tokenDate}; Max-Age=86400`,
          ])
          .redirect('http://localhost:3000');
      } else {
        throw new Error('Access token not found');
      }
    } catch (err) {
      // Handle errors
      req.res?.status(500).send(err);
    }
  }

  @Get('refreshtoken') //specify the request type
  public async refreshToken(
    @Request() req: express.Request,
  ): Promise<LoginResponse | undefined> {
    try {
      if (req.session.passport) {
        const refresh_token = req.session.passport.user.refresh_token;
        const COMBINED_IDS = `${CLIENT_ID}:${CLIENT_SECRET}`;
        const spotifyResponse = await fetchSpotify<LoginResponse>({
          url: 'https://accounts.spotify.com/api/token',
          init: {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(COMBINED_IDS).toString(
                'base64',
              )}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refresh_token,
            }).toString(),
          },
        });
        const tokenDate = Date.now();
        req.res?.setHeader('set-cookie', [
          `accessToken=${spotifyResponse.access_token}; Max-Age=86400`,
          `date=${tokenDate}; Max-Age=86400`,
        ]);
        return spotifyResponse;
      }

      return undefined;
    } catch (err) {
      console.error(err);
      return err as LoginResponse;
    }
  }
}
