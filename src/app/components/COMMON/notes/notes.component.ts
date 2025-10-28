import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { SaveNote } from '../../../MODEL/MODEL';
import { AlertService } from '../../../services/alert.service';
import { NoteDetailsDto, NoteDto } from '../../../DTO/DTO';
import { TooltipDirective } from '../../../shared/tooltip.directive';


@Component({
  selector: 'app-notes',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TooltipDirective],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor!: ElementRef<HTMLElement>;
  newNote = '';
noteTitle: any;
notePinned: any;
noteArchived: any;
selectedNote: NoteDetailsDto | null = null;
  showNoteDetailPopup = false;

  constructor(
    private notesService: CommonService,
    private alertservice: AlertService
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  allnotes:NoteDto[] = [];
addNote() {
  
  if (!this.noteTitle.trim() && !this.newNote.trim()) return;

  const note: SaveNote = {
    title: this.noteTitle,
    content: this.newNote,
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

closePopup() {
    this.showPopup = false;
    // optional: clear editor content
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = '';
      }
    }, 0);
  }

  // helper: put caret at end (so focus is useful)
  placeCaretAtEnd(el: HTMLElement) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
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

 openPopup(editHtml: string = '') {
    this.showPopup = true;
    this.newNote = editHtml || ''; // keep model
    // wait for view to render, then set editor innerHTML and focus
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        this.editor.nativeElement.innerHTML = this.newNote || '';
        this.editor.nativeElement.focus();
        // place caret at end:
        this.placeCaretAtEnd(this.editor.nativeElement);
      }
    }, 0);
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

onNoteInput(event: Event) {
    const el = event.target as HTMLElement;
    this.newNote = el.innerHTML;
    // optional: console.log('live html:', this.newNote);
  }


viewNote(rowid: number) {
  this.selectedNote = null; // reset to show loading
    this.notesService.GetNoteDetailsByIdAsync(rowid).subscribe({
      next: (note) => {
        if (note) {
          this.selectedNote = note;
          this.showNoteDetailPopup = true;
          console.log('Fetched note details:', this.selectedNote);
        } else {
          console.warn('No note found for this ID.');
        }
      },
      error: (err) => {
        console.error('Error fetching note details:', err);
      },
    });

  }

  closeNoteDetailPopup() {
    this.showNoteDetailPopup = false;
    this.selectedNote = null;
  }
  
  editNote(note: any) {
  // Logic to edit the note
  console.log('Editing note:', note);
}

}