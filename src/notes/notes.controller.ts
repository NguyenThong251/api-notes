import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Task } from './note.schema';
import { NotesService } from './notes.service';

@Controller('tasks')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() taskData: Partial<Task>, @Req() req): Promise<Task> {
    return this.notesService.create({ ...taskData, owner: req.userId });
  }

  @Get()
  async findAll(@Req() req): Promise<Task[]> {
    return this.notesService.findAll(req.userId);
  }

  @Get('shared')
  async findShared(@Req() req): Promise<Task[]> {
    return this.notesService.findShared(req.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() taskData: Partial<Task>, @Req() req): Promise<Task> {
    return this.notesService.update(id, taskData, req.userId);
  }

  @Post(':id/share')
  async share(@Param('id') id: string, @Body('zaloId') zaloId: string, @Req() req): Promise<Task> {
    return this.notesService.share(id, zaloId, req.userId);
  }

  @Get('report')
  async getReport(@Req() req): Promise<any> {
    return this.notesService.getReport(req.userId);
  }
}