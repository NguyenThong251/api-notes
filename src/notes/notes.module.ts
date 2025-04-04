import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "./note.schema";
import { UsersModule } from "src/users/users.module";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      UsersModule,
      HttpModule,
    ],
    controllers: [NotesController],
    providers: [NotesService],
  })
  export class NotesModule {}