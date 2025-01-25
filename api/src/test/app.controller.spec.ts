import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { TaskStatus } from '../app.dto';

describe('AppController', () => {
  let controller: AppController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return tasks with pagination when valid parameters are provided', async () => {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Desc 1',
          status: TaskStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await controller.getTasks(1, 10);

      expect(result).toBe(mockTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it('should throw BadRequestException when page is less than 1', async () => {
      await expect(controller.getTasks(0, 10)).rejects.toThrow(
        'Page must be greater than 0',
      );
    });

    it('should throw BadRequestException when limit is less than 1', async () => {
      await expect(controller.getTasks(1, 0)).rejects.toThrow(
        'Limit must be greater than 0',
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      (prisma.task.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getTasks(1, 10)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a single task when valid ID is provided', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'Task 1',
        status: TaskStatus.PENDING,
        description: 'Desc 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.getTaskById('1');

      expect(result).toBe(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when task does not exist', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(controller.getTaskById('999')).rejects.toThrow(
        'Task not found',
      );
    });

    it('should throw BadRequestException when ID is invalid', async () => {
      await expect(controller.getTaskById('')).rejects.toThrow(
        'Invalid task ID',
      );
    });

    it('should throw InternalServerErrorException when service fails', async () => {
      (prisma.task.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );
      await expect(controller.getTaskById('1')).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Desc',
        status: TaskStatus.PENDING,
      };
      const mockTask: Task = {
        id: '1',
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.createTask(createTaskDto);

      expect(result).toBe(mockTask);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: createTaskDto,
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const mockTask: Task = {
        id: '1',
        ...updateTaskDto,
        description: 'Desc 1',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.updateTask('1', updateTaskDto);

      expect(result).toBe(mockTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateTaskDto,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'Task 1',
        status: TaskStatus.PENDING,
        description: 'Desc 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.task.delete as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.deleteTask('1');

      expect(result).toBe(mockTask);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
