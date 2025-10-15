/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';
import { url } from 'inspector';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const courses = await this.prisma.course.findMany();
    const courseNumber = courses.length;

    const students = await this.prisma.user.findMany({
      where: {
        role: "USER",
      }
    })
    const studentCount = students.length;

    const challenges = await this.prisma.challenge.findMany();
    const challengeCount = challenges.length;
    
    const premium = await this.prisma.user.findMany({
      where: {
        isPremium: true,
      }
    })
    const premiumCount = premium.length

    return {courseNumber, studentCount, challengeCount, premiumCount};
  }

  async getGraphStats() {
    const data = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: { id: true },
    });

    // Transform into month-based aggregation
    const stats = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const month = date.toLocaleString("default", { month: "short" });

      const users = data.filter(d => 
        d.createdAt.getMonth() === date.getMonth() &&
        d.createdAt.getFullYear() === date.getFullYear()
      ).reduce((sum, d) => sum + d._count.id, 0);

      return { month, users };
    });

    return stats;
  }



  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async deleteUser(id: string) {
  const userId = Number(id);

  try {
    // Delete related messages first
    await this.prisma.message.deleteMany({
      where: { receiverId: userId }
    });

    // Now delete the user
    await this.prisma.user.delete({
      where: { id: userId }
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    throw new HttpException("Unable to delete User", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isPremium: dto.isPremium,
        email: dto.email,
        username: dto.username,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
  }
  }

  async createLessonSolution(dto: {lessonId: number, solution: string}) {
    try {
      await this.prisma.lessonSolution.create({
        data: dto
      });

      return {message: "Solution created Successfully"};
    } catch (error) {
      console.log(error);
      throw new HttpException("INTERNAL SERVER ERROR:", HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  async getLessonCompleters(challengeId: number) {
  const challengeCompleters = await this.prisma.completedChallenges.findMany({
    where: { challengeId }
  });

  const completerUsers = await Promise.all(
    challengeCompleters.map(async (challengeCompleter) => {

      const someObj = {
        user: await this.prisma.user.findUnique({
            where: { id: challengeCompleter.userId },
            select: {
              email: true,
              username: true,
              photo: true,
              provider: true
            }
          }),
        id: challengeCompleter.id,
        completionTime: challengeCompleter.createdAt,
        url: challengeCompleter.url,
        solution: challengeCompleter.userSolution,
        correct: challengeCompleter.correct
      }
      return someObj
    })
  );

  return completerUsers;
}

async correctCompleters(completerId: number) {
  const completer = await this.prisma.completedChallenges.findFirst({
    where: {
      id: completerId
    }
  })

  if(!completer) {
    throw new NotFoundException("Completion not found")
  }

  try {
    await this.prisma.completedChallenges.update({
      where: {
        id: completerId
      },
      data: {
        correct: "WRIGHT"
      }
    })

    return {
      message: "Done correcting completer"
    }
  } catch (error) {
    throw new InternalServerErrorException("Unable to correct")
  }
}

}
