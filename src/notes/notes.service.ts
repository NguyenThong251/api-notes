import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(content: string): Promise<Note> {
    const newNote = new this.noteModel({ content });
    return newNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async delete(id: string): Promise<void> {
    await this.noteModel.findByIdAndDelete(id).exec();
  }
}
