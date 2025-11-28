import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
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
import { SaveTemplate } from '../../../../MODEL/MODEL';
import { FilterBySearchPipe } from '../ADDONS/filter-by-search.pipe';

@Component({
  selector: 'app-formate-editor',
  standalone: true,
  imports: [EditorModule, FormsModule, CommonModule, FilterBySearchPipe],
  templateUrl: './formate-editor.component.html',
  styleUrls: ['./formate-editor.component.css']
})

// @Pipe({ name: 'filterBySearch' })
export class FormateEditorComponent implements OnInit, PipeTransform {


  transform(items: any[], search: string): any[] {
    if (!items || !search) return items;
    const lower = search.toLowerCase();
    return items.filter(item => item.key.toLowerCase().includes(lower));
  }

  addonSearch: string = '';
  alltemplates: TemplateOption[] = [];
  savetemplate: SaveTemplate = {} as SaveTemplate;
  selectedid = 1;
  selectedTemplateKey: TemplateKey = 'receipt'; // use TemplateKey for correct indexing

  constructor(
    private commonservice: CommonService,
    private alertservice: AlertService
  ) { }
  ngOnInit(): void {
    this.loadTemplates();
    this.GetTemplateAsync();

  }
  loadTemplates() {
    this.commonservice.GetTemplates().subscribe({
      next: (res) => {
        if (res) {
          this.alltemplates = res;
          this.selectedTemplateKey = res[0].key as TemplateKey;
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
    content_css: '/assets/editor-styles.css',
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
      'link image media table | code preview fullscreen| insertbox',
    menubar: 'file edit view insert format tools table help',
    setup: (editor: any) => {
      editor.on('init', () => {
        console.log('✅ TinyMCE initialized (self-hosted)');
      });
       editor.ui.registry.addButton('insertbox', {
  text: 'Box',
  icon: 'table',
  onAction: () => {
    editor.insertContent(`
      <table class="my-box-table" style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="border:2px solid black; padding:12px;">
            Your content here...
          </td>
        </tr>
      </table>
    `);
  }
});

    }
  };


  templates = TEMPLATES;

  get selectedTemplate(): Record<string, string> {
    return this.templates[this.selectedTemplateKey];
  }


  insertField(fieldKey: string) {
    this.templateContent += `{{${fieldKey}}}`;
  }



  saveTemplate() {
    this.SaveTemplateAsync();
  }

  SaveTemplateAsync() {
    this.savetemplate = {
      categoryid: this.selectedid, // example category ID
      name: this.selectedTemplateKey,
      htmlcontent: this.templateContent,
      csscontent: '',
      jscontent: '',
      schemajson: '',
      isdefault: false
    };
    this.commonservice.SaveTemplateAsync(this.savetemplate).subscribe({
      next: (response) => {
        this.alertservice.showAlert('Template saved successfully!', 'success');
      },
      error: (error) => {
        this.alertservice.showAlert('Failed to save template:', error);
      }
    });
  }

  GetTemplateAsync() {
    this.commonservice.GetTemplateAsync(this.selectedid, 0).subscribe({
      next: (res) => {
        if (res) {
          this.templateContent = res.htmlcontent || '';
        }
      },
      error: (err) => {
        this.alertservice.showAlert('Failed to load template:', err);
      }
    });
  }
}