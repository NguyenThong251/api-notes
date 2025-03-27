import { Controller, Get, Post, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body('content') content: string): Promise<Note> {
    return this.notesService.create(content);
  }

  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.notesService.delete(id);
  }
}