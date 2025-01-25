import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getTasks(page: number, limit: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
    });
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async createTask(
    createTaskDto: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async updateTask(id: string, updateTaskDto: Partial<Task>): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
