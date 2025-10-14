/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard, JwtGuard } from 'src/guard';
import { EditUserDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminServices:  AdminService) {}
  @UseGuards(JwtGuard, AdminGuard)
  @Get('stats')
  getDashboardStats() {
    return this.adminServices.getDashboardStats();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('')
  getUsers() {
    return this.adminServices.getUsers();
  }
  
  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminServices.deleteUser(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: EditUserDto,
  ) {
    return this.adminServices.editUser(+id, { ...dto });
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/lesson/solution')
  createLessonSolution(@Body() dto: {lessonId: number, solution: string}) {
    return this.adminServices.createLessonSolution(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('/challenge-completers/:challengeId')
  GetLessonCompleters(@Param('challengeId') challengeId: number) {
    return this.adminServices.getLessonCompleters(challengeId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('/graph-stats')
  getGraphStats() {
    return this.adminServices.getGraphStats();
  }
}
