/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { jwtDecode } from "jwt-decode";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  // --- SIGNUP ---
  @Post("signup")
  async signup(@Res() res: Response, @Body() dto: AuthDto) {
    const { access_token, refresh_token } = await this.authService.signup(dto);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token });
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { access_token, refresh_token, user } = await this.authService.login(dto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true on Render.com
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ access_token, user });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });
    const { access_token, user } = await this.authService.refresh(refreshToken);
    res.json({ access_token, user });
  }

  @Get("get-me")
  async getMe(@Req() req: Request) {
    const refresh_token = req.cookies["refresh_token"];
    const token = jwtDecode<any>(refresh_token);

    return this.authService.getMe(token);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("refresh_token");
    return res.json({ message: "Logged out successfully" });
  }
}
