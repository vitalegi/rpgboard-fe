import { Service } from "typedi";
import Note from "../models/Note";

@Service()
export default class NoteService {
  public async getNote(noteId: string): Promise<Note> {
    if (noteId === "1") {
      return Promise.resolve(this.helloworld1());
    }
    return Promise.resolve(this.helloworld2());
  }

  protected helloworld1(): Note {
    const note = new Note();
    note.id = "1";
    note.ownerId = "aaa";
    note.title = "Hello world 1";
    note.text = "# Title\n\nHello world";
    return note;
  }

  protected helloworld2(): Note {
    const note = new Note();
    note.id = "2";
    note.ownerId = "bbb";
    note.title = "Hello world 2";
    note.text = "# Title\n\nHello world __everything is fine__.";
    return note;
  }
}
