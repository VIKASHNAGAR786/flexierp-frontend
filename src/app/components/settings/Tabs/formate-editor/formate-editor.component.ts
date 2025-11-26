import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

// ✅ Manually import TinyMCE core, theme, icons, and plugins
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import { TEMPLATES, TemplateKey } from '../ADDONS/templates.data';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { AlertService } from '../../../../services/alert.service';
import { TemplateOption } from '../../../../DTO/DTO';

@Component({
  selector: 'app-formate-editor',
  standalone: true,
  imports: [EditorModule, FormsModule, CommonModule],
  templateUrl: './formate-editor.component.html',
  styleUrls: ['./formate-editor.component.css']
})
export class FormateEditorComponent implements OnInit {

  alltemplates: TemplateOption[] = [];
  constructor(
    private commonservice : CommonService,
    private alertservice : AlertService
  ) { }
  ngOnInit(): void {
      this.loadTemplates();
  }
    loadTemplates() {
    this.commonservice.GetTemplates().subscribe({
      next: (res) => {
        if (res) {
          this.alltemplates = res;
        }
      },
      error: (err) => {
        this.alertservice.showAlert('Failed to load notes:', err);
      }
    });
  }
  templateContent = '<p>Start writing your template...</p>';
  author = "Vikash Nagar";

  // License key for self-hosted TinyMCE
  licenseKey = 'gpl';

  editorInit = {
    base_url: '/tinymce', // point to your self-hosted folder in assets
    suffix: '.min',
     branding: false,       // ✅ removes TinyMCE logo
  promotion: false,      // ✅ removes “Get all features” link
    licenseKey: this.licenseKey,
       plugins: [
    'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
    'charmap', 'code', 'codesample', 'directionality', 'emoticons',
    'fullscreen', 'help', 'image', 'insertdatetime', 'link',
    'lists', 'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars',
    'save', 'searchreplace', 'table', 'visualblocks', 'visualchars', 'wordcount'
  ],
    toolbar:
      'undo redo | formatselect | bold italic underline | ' +
      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
      'link image media table | code preview fullscreen',
    menubar: 'file edit view insert format tools table help',
    setup: (editor: any) => {
      editor.on('init', () => {
        console.log('✅ TinyMCE initialized (self-hosted)');
      });
    }
  };


   templates = TEMPLATES;
  selectedTemplateKey: TemplateKey = 'receipt'; // strongly typed

  get selectedTemplate() {
    return this.templates[this.selectedTemplateKey];
  }



   insertField(fieldKey: string) {
    this.templateContent += `{{${fieldKey}}}`;
  }



  saveTemplate() {
    console.log('Saving template:', this.templateContent);
  }
}
