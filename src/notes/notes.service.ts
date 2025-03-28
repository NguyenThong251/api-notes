import { User, UserDocument } from "src/users/user.schema";
import { Task, TaskDocument } from "./note.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    const newTask = new this.taskModel(taskData);
    await newTask.save();
    if (newTask.reminder) this.scheduleReminder(newTask);
    return newTask;
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ owner: userId }).sort({ dueDate: 1 }).exec();
  }

  async findShared(userId: string): Promise<Task[]> {
    return this.taskModel.find({ sharedWith: userId }).sort({ dueDate: 1 }).exec();
  }

  async update(id: string, taskData: Partial<Task>, userId: string): Promise<Task> {
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, owner: userId }, taskData, { new: true })
      .exec();
    
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found or you don't have permission to update it`);
    }
    
    return updatedTask;
  }

  async share(id: string, zaloId: string, userId: string): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: id, owner: userId },
        { $addToSet: { sharedWith: zaloId } },
        { new: true },
      )
      .exec();
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found or you don't have permission to share it`);
    }
    
    this.notifyShared(zaloId, task);
    return task;
  }

  async getReport(userId: string): Promise<any> {
    const total = await this.taskModel.countDocuments({ owner: userId }).exec();
    const completed = await this.taskModel.countDocuments({ owner: userId, completed: true }).exec();
    return { totalTasks: total, completedTasks: completed, completionRate: total ? (completed / total) * 100 : 0 };
  }

  async scheduleReminder(task: Task) {
    const znsToken = process.env.ZNS_TOKEN;
    setTimeout(() => {
      this.httpService
        .post(
          "https://openapi.zalo.me/v2.0/oa/message",
          {
            recipient: { user_id: task.owner },
            message: { text: `Nhắc nhở: ${task.content} đến hạn lúc ${task.dueDate}` },
          },
          { headers: { "access_token": znsToken } },
        )
        .subscribe();
    }, new Date(task.reminder).getTime() - Date.now());
  }

  async notifyShared(zaloId: string, task: Task) {
    const znsToken = process.env.ZNS_TOKEN;
    this.httpService
      .post(
        "https://openapi.zalo.me/v2.0/oa/message",
        {
          recipient: { user_id: zaloId },
          message: { text: `Bạn được chia sẻ task: ${task.content} từ ${task.owner}` },
        },
        { headers: { "access_token": znsToken } },
      )
      .subscribe();
  }
}