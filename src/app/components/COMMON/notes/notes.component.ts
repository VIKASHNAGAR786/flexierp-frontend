import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { SaveNote } from '../../../MODEL/MODEL';
import { AlertService } from '../../../services/alert.service';
import { NoteDto } from '../../../DTO/DTO';
import { TooltipDirective } from '../../../shared/tooltip.directive';


@Component({
  selector: 'app-notes',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TooltipDirective],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  newNote = '';
noteTitle: any;
notePinned: any;
noteArchived: any;

  constructor(
    private notesService: CommonService,
    private alertservice: AlertService
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  allnotes:NoteDto[] = [];
addNote() {
  const trimmed = this.newNote.trim();
  const title = this.noteTitle.trim();
  if (!trimmed || !title) return;

  const note: SaveNote = {
    title: title,
    content: trimmed,
    authorId: 1, // Replace with actual user ID
    isPinned: this.notePinned,
    isArchived: this.noteArchived
  };

  try {
    this.notesService.savenotes(note).subscribe({
      next: () => {
        this.loadNotes();
        this.newNote = '';
        this.noteTitle = '';
        this.notePinned = false;
        this.noteArchived = false;
      },
      error: (err) => {
        this.alertservice.showAlert('Failed to save note:', err);
      },
      complete: () => {
       this.alertservice.showAlert('✅ Note saved successfully.', 'success');
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    this.alertservice.showAlert('❌ Something went wrong.', "error");
  }
}

  deleteNote(note: any) {
    this.allnotes = this.allnotes.filter(n => n !== note);
  }

  pinNote(note: any) {
    this.allnotes = [note, ...this.allnotes.filter(n => n !== note)];
  }

  loadNotes() {
    this.notesService.GetAllNotes().subscribe({
      next: (data) => {
        if (data) {
          this.allnotes = data;
        }
      },
      error: (err) => {
        this.alertservice.showAlert('Failed to load notes:', err);
      }
    });
  }

  showPopup = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.clearForm();
  }

   clearForm() {
    this.noteTitle = '';
    this.newNote = '';
    this.notePinned = false;
    this.noteArchived = false;
  }
  formatText(command: string) {
  document.execCommand(command, false, '');
}

viewNote(note: any) {
  // Logic to view the note details
  console.log('Viewing note:', note);
}
editNote(note: any) {
  // Logic to edit the note
  console.log('Editing note:', note);
}

}