import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Task } from '@prisma/client';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTasks(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Task[]> {
    if (page < 1) throw new BadRequestException('Page must be greater than 0');
    if (limit < 1)
      throw new BadRequestException('Limit must be greater than 0');

    try {
      return await this.appService.getTasks(page, limit);
    } catch (error) {
      console.error(error); // Log the error
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    if (!id) throw new BadRequestException('Invalid task ID');

    try {
      const task = await this.appService.getTaskById(id);
      if (!task) throw new NotFoundException('Task not found');
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Post()
  async createTask(
    @Body() createTaskDto: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    try {
      return await this.appService.createTask(createTaskDto);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<Task>,
  ): Promise<Task> {
    try {
      console.log(updateTaskDto);
      return await this.appService.updateTask(id, updateTaskDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    try {
      return await this.appService.deleteTask(id);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
