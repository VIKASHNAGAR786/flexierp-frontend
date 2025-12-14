import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// TinyMCE imports
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
// import 'tinymce/plugins/sticky';

import { TEMPLATES, TemplateKey, FieldCategory, FIELD_CATEGORIES } from '../ADDONS/templates.data';
import { CommonService } from '../../../../services/common.service';
import { AlertService } from '../../../../services/alert.service';
import { SaveTemplate } from '../../../../MODEL/MODEL';
import { TemplateOption } from '../../../../DTO/DTO';

@Component({
  selector: 'app-formate-editor',
  standalone: true,
  imports: [
    EditorComponent,
    FormsModule,
    CommonModule,
    TitleCasePipe
  ],
  templateUrl: './formate-editor.component.html',
  styleUrls: ['./formate-editor.component.css']
})
export class FormateEditorComponent implements OnInit, OnDestroy {

  // ============================================================================
  // #region COMPONENT VARIABLES & INITIALIZATION
  // ============================================================================

  private destroy$ = new Subject<void>();

  // Search & Filter State
  addonSearch: string = '';
  selectedCategory: string = 'all';

  // Template Data
  alltemplates: TemplateOption[] = [];
  savetemplate: SaveTemplate = {} as SaveTemplate;
  selectedid = 1;
  selectedTemplateKey: TemplateKey = 'receipt';
  templates = TEMPLATES;

  // Editor Content & Configuration
  templateContent = '<p>Start writing your template...</p>';
  author = "Vikash Nagar";
  licenseKey = 'gpl';

  // Undo/Redo History
  contentHistory: string[] = [];
  currentHistoryIndex: number = -1;
  maxHistorySize = 20;

  // UI State Management
  isPreviewVisible = false;
  isSidebarVisible = true;
  isLeftSidebarVisible = true;
  isRightPreviewVisible = true;
  showFieldCategories = true;
  activeInfoPanel: string | null = 'template-info';
  recentlyUsedFields: string[] = [];

  // Preview Data
  previewContent: string = '';
  previewData = {
    CustomerName: 'John Doe',
    PhoneNo: '+91 9876543210',
    Email: 'john@example.com',
    PaymentMode: 'Cash',
    TotalAmount: '₹2,500.00',
    InvoiceDate: '2024-01-15',
    invoiceno: 'INV-001',
    CompanyName: 'FlexERP Solutions',
  };

  // Field Categories with Icons
  fieldCategories = FIELD_CATEGORIES;

  constructor(
    private commonservice: CommonService,
    private alertservice: AlertService
  ) { }

  ngOnInit(): void {
    this.loadTemplates();
    this.GetTemplateAsync();
    this.saveToHistory(this.templateContent);
    this.loadRecentlyUsedFields();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================================
  // #endregion COMPONENT VARIABLES & INITIALIZATION
  // ============================================================================

  // ============================================================================
  // #region TINYMCE EDITOR CONFIGURATION
  // ============================================================================

  editorInit = {
    base_url: '/tinymce',
    suffix: '.min',
    branding: false,
    promotion: false,
    licenseKey: this.licenseKey,

    // Sticky toolbar configuration
    toolbar_sticky: true,
    toolbar_sticky_offset: 0,
    menubar_sticky: true,

    content_css: '/assets/editor-styles.css',

    // Plugins configuration
    plugins: [
      'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
      'charmap', 'code', 'codesample', 'directionality', 'emoticons',
      'fullscreen', 'help', 'image', 'insertdatetime', 'link',
      'lists', 'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars',
      'save', 'searchreplace', 'table', 'visualblocks', 'visualchars', 'wordcount',
      'sticky' // Required for sticky toolbar
    ],

    // Toolbar configuration
    toolbar:
      'undo redo | formatselect | bold italic underline | ' +
      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
      'link image media table | code preview fullscreen| insertbox | templateFields',

    menubar: 'file edit view insert format tools table help',

    // Editor settings
    height: '100%',
    min_height: 500,
    resize: false,
    statusbar: true,

    setup: (editor: any) => {
      // Custom button for inserting fields
      editor.ui.registry.addButton('templateFields', {
        text: 'Insert Fields',
        icon: 'placeholder',
        tooltip: 'Insert template fields',
        onAction: () => {
          this.openFieldPickerModal();
        }
      });

      // Custom button for inserting info boxes
      editor.ui.registry.addButton('insertbox', {
        text: 'Box',
        icon: 'table',
        onAction: () => {
          editor.insertContent(`
            <div class="info-box" style="border: 2px solid #e5e7eb; padding: 16px; margin: 16px 0; border-radius: 8px; background: #f9fafb;">
              <h3 style="margin-top: 0; color: #374151;">Information Box</h3>
              <p>Your content here...</p>
            </div>
          `);
        }
      });

      // Editor initialization event
      editor.on('init', () => {
        console.log('✅ TinyMCE initialized');
        this.forceStickyToolbar();
      });

      // Re-apply sticky styles on scroll
      editor.on('ScrollWindow', () => {
        this.forceStickyToolbar();
      });

      // Track changes for undo history
      editor.on('change', () => {
        const content = editor.getContent();
        this.saveToHistory(content);
      });
    }
  };

  /**
   * Forces TinyMCE toolbar to be sticky when scrolling
   */
  forceStickyToolbar() {
    setTimeout(() => {
      const menubar = document.querySelector('.tox-menubar') as HTMLElement;
      const toolbar = document.querySelector('.tox-toolbar__primary') as HTMLElement;
      const editorContainer = document.querySelector('.tox-tinymce') as HTMLElement;
      const editArea = document.querySelector('.tox-edit-area') as HTMLElement;

      // Ensure editor container has proper layout
      if (editorContainer) {
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        editorContainer.style.height = '100%';
      }

      // Make menubar sticky
      if (menubar) {
        menubar.style.position = 'sticky';
        menubar.style.top = '0';
        menubar.style.zIndex = '1000';
        menubar.style.backgroundColor = 'white';
        menubar.style.borderBottom = '1px solid #e5e7eb';
        menubar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }

      // Make toolbar sticky
      if (toolbar) {
        toolbar.style.position = 'sticky';
        toolbar.style.top = menubar ? '39px' : '0';
        toolbar.style.zIndex = '999';
        toolbar.style.backgroundColor = 'white';
        toolbar.style.borderBottom = '1px solid #e5e7eb';
        toolbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }

      // Ensure edit area is scrollable
      if (editArea) {
        editArea.style.flex = '1';
        editArea.style.overflowY = 'auto';
      }
    }, 100);
  }

  // ============================================================================
  // #endregion TINYMCE EDITOR CONFIGURATION
  // ============================================================================

  // ============================================================================
  // #region TEMPLATE & FIELD MANAGEMENT
  // ============================================================================

  /**
   * Gets the currently selected template
   */
  get selectedTemplate(): Record<string, string> {
    return this.templates[this.selectedTemplateKey] || {};
  }

  /**
   * Gets filtered fields based on search and category
   */
  get filteredFields(): { key: string, value: string }[] {
    const fields = Object.entries(this.selectedTemplate)
      .map(([key, value]) => ({ key, value }));

    // Filter by search term
    if (this.addonSearch) {
      const searchLower = this.addonSearch.toLowerCase();
      return fields.filter(f =>
        f.key.toLowerCase().includes(searchLower) ||
        f.value.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (this.selectedCategory !== 'all') {
      const categoryFields = this.fieldCategories
        .find(c => c.id === this.selectedCategory)?.fields || [];
      return fields.filter(f => categoryFields.includes(f.value));
    }

    return fields;
  }

  /**
   * Loads all available templates
   */
  loadTemplates() {
    this.commonservice.GetTemplates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.alltemplates = res;
            this.selectedTemplateKey = res[0].key as TemplateKey;
            this.updatePreview();
          }
        },
        error: (err) => {
          this.alertservice.showAlert('Failed to load templates', 'error');
        }
      });
  }

  /**
   * Gets template from server
   */
  GetTemplateAsync() {
    this.commonservice.GetTemplateAsync(this.selectedid, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.templateContent = res.htmlcontent || '';
            this.saveToHistory(this.templateContent);
            this.updatePreview();
          }
        },
        error: (err) => {
          this.alertservice.showAlert('Failed to load template', 'error');
        }
      });
  }

  /**
   * Saves template to server
   */
  saveTemplate() {
    this.savetemplate = {
      categoryid: this.selectedid,
      name: this.selectedTemplateKey,
      htmlcontent: this.templateContent,
      csscontent: '',
      jscontent: '',
      schemajson: '',
      isdefault: false
    };

    this.commonservice.SaveTemplateAsync(this.savetemplate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.alertservice.showAlert('Template saved successfully!', 'success');
        },
        error: (error) => {
          this.alertservice.showAlert('Failed to save template', 'error');
        }
      });
  }

  // ============================================================================
  // #endregion TEMPLATE & FIELD MANAGEMENT
  // ============================================================================

  // ============================================================================
  // #region FIELD INSERTION METHODS
  // ============================================================================

  /**
   * Inserts a single field into the editor
   */
  insertField(fieldValue: string, fieldName?: string) {
    const fieldTag = `{{${fieldValue}}}`;

    // Insert at cursor position in TinyMCE
    const editor = (window as any).tinymce?.activeEditor;
    if (editor) {
      editor.insertContent(fieldTag);
      this.templateContent = editor.getContent();
    } else {
      // Fallback: append to end
      this.templateContent += fieldTag;
    }

    // Add to recently used fields
    this.addToRecentlyUsed(fieldValue, fieldName || fieldValue);

    // Save to history
    this.saveToHistory(this.templateContent);

    // Show success message
    this.alertservice.showAlert(
      `Field "${fieldName || fieldValue}" inserted`,
      'success'
    );

    // Update preview
    this.updatePreview();
  }

  /**
   * Inserts multiple fields at once
   */
  insertMultipleFields(fields: string[]) {
    let fieldsText = fields.map(f => `{{${f}}}`).join(' ');
    const editor = (window as any).tinymce?.activeEditor;
    if (editor) {
      editor.insertContent(fieldsText);
      this.templateContent = editor.getContent();
    } else {
      this.templateContent += fieldsText;
    }
    this.saveToHistory(this.templateContent);
  }

  /**
   * Inserts common layout templates
   */
  insertCommonLayout(layoutType: 'header' | 'footer' | 'table' | 'signature') {
    const layouts = {
      header: `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; margin-bottom: 5px;">{{CompanyName}}</h1>
          <p style="color: #6b7280;">{{Address}} | Phone: {{ContactNo}}</p>
        </div>
      `,
      footer: `
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <p>Thank you for your business!</p>
          <p style="color: #6b7280; font-size: 12px;">
            For any queries, contact: {{ContactNo}} | {{CompanyEmail}}
          </p>
        </div>
      `,
      table: `
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px;">Column 1</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Column 2</th>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 8px;">{{Field1}}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px;">{{Field2}}</td>
          </tr>
        </table>
      `,
      signature: `
        <div style="margin-top: 40px;">
          <p>Sincerely,</p>
          <p style="margin-top: 30px;">{{AuthorName}}</p>
          <p style="color: #6b7280; font-size: 12px;">{{AuthorTitle}}</p>
        </div>
      `
    };

    this.insertField(layouts[layoutType]);
  }

  // ============================================================================
  // #endregion FIELD INSERTION METHODS
  // ============================================================================

  // ============================================================================
  // #region UNDO/REDO HISTORY MANAGEMENT
  // ============================================================================

  /**
   * Saves current content to history
   */
  saveToHistory(content: string) {
    // Remove future history if we're not at the end
    if (this.currentHistoryIndex < this.contentHistory.length - 1) {
      this.contentHistory = this.contentHistory.slice(0, this.currentHistoryIndex + 1);
    }

    // Add new content
    this.contentHistory.push(content);
    this.currentHistoryIndex++;

    // Limit history size
    if (this.contentHistory.length > this.maxHistorySize) {
      this.contentHistory.shift();
      this.currentHistoryIndex--;
    }
  }

  /**
   * Undo last change
   */
  undo() {
    if (this.currentHistoryIndex > 0) {
      this.currentHistoryIndex--;
      this.templateContent = this.contentHistory[this.currentHistoryIndex];

      const editor = (window as any).tinymce?.activeEditor;
      if (editor) {
        editor.setContent(this.templateContent);
      }
    }
  }

  /**
   * Redo previously undone change
   */
  redo() {
    if (this.currentHistoryIndex < this.contentHistory.length - 1) {
      this.currentHistoryIndex++;
      this.templateContent = this.contentHistory[this.currentHistoryIndex];

      const editor = (window as any).tinymce?.activeEditor;
      if (editor) {
        editor.setContent(this.templateContent);
      }
    }
  }

  // ============================================================================
  // #endregion UNDO/REDO HISTORY MANAGEMENT
  // ============================================================================

  // ============================================================================
  // #region RECENTLY USED FIELDS MANAGEMENT
  // ============================================================================

  /**
   * Adds field to recently used list
   */
  addToRecentlyUsed(fieldValue: string, fieldName: string) {
    // Remove if already exists
    this.recentlyUsedFields = this.recentlyUsedFields.filter(f => f !== fieldValue);

    // Add to beginning
    this.recentlyUsedFields.unshift(fieldValue);

    // Limit to 10 items
    if (this.recentlyUsedFields.length > 10) {
      this.recentlyUsedFields.pop();
    }

    // Store in localStorage for persistence
    localStorage.setItem('recentlyUsedFields', JSON.stringify(this.recentlyUsedFields));
  }

  /**
   * Loads recently used fields from localStorage
   */
  loadRecentlyUsedFields() {
    const stored = localStorage.getItem('recentlyUsedFields');
    if (stored) {
      this.recentlyUsedFields = JSON.parse(stored);
    }
  }

  // ============================================================================
  // #endregion RECENTLY USED FIELDS MANAGEMENT
  // ============================================================================

  // ============================================================================
  // #region PREVIEW FUNCTIONALITY
  // ============================================================================

  /**
   * Updates the preview content with sample data
   */
  updatePreview() {
    let preview = this.templateContent;

    // Replace all field tags with sample data
    Object.entries(this.previewData).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      preview = preview.replace(pattern,
        `<span class="preview-field" style="background:#dbeafe; padding:2px 4px; border-radius:4px;">${value}</span>`);
    });

    this.previewContent = preview;
  }

  /**
   * Toggles preview visibility
   */
  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
    this.activeInfoPanel = 'preview';
    this.isSidebarVisible = true;

    if (this.isPreviewVisible) {
      this.updatePreview();
    }
  }

  // ============================================================================
  // #endregion PREVIEW FUNCTIONALITY
  // ============================================================================

  // ============================================================================
  // #region SIDEBAR & UI STATE MANAGEMENT
  // ============================================================================

  /**
   * Toggles main sidebar visibility
   */
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    if (this.isSidebarVisible && !this.activeInfoPanel) {
      this.activeInfoPanel = 'template-info';
    }
  }

  /**
   * Toggles left sidebar (fields panel) visibility
   */
  toggleLeftSidebar() {
    this.isLeftSidebarVisible = !this.isLeftSidebarVisible;
  }

  /**
   * Toggles info panel sections
   */
  toggleInfoPanel(panel: string) {
    this.activeInfoPanel = this.activeInfoPanel === panel ? null : panel;
    this.isSidebarVisible = true;
  }

  /**
   * Closes the info panel
   */
  closeInfoPanel() {
    this.activeInfoPanel = null;
    if (this.isMobile()) {
      this.isSidebarVisible = false;
    }
  }

  /**
   * Toggles right preview panel
   */
  toggleRightPreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  /**
   * Gets icon class for panel
   */
  getPanelIcon(panel: string): string {
    const icons: { [key: string]: string } = {
      'preview': 'bi-eye text-purple-500',
      'template-info': 'bi-info-circle text-blue-500',
      'tips': 'bi-lightbulb text-yellow-500',
      'field-groups': 'bi-collection text-purple-500'
    };
    return icons[panel] || 'bi-info-circle';
  }

  /**
   * Gets title for panel
   */
  getPanelTitle(panel: string): string {
    const titles: { [key: string]: string } = {
      'preview': 'Live Preview',
      'template-info': 'Template Information',
      'tips': 'Quick Tips',
      'field-groups': 'Field Groups'
    };
    return titles[panel] || 'Information';
  }

  /**
   * Checks if device is mobile
   */
  isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  // ============================================================================
  // #endregion SIDEBAR & UI STATE MANAGEMENT
  // ============================================================================

  // ============================================================================
  // #region UTILITY METHODS
  // ============================================================================

  /**
   * Gets template icon
   */
  getTemplateIcon(templateKey: any): string {
    // Implement template icon logic
    return 'bi-file-earmark-text';
  }

  /**
   * Gets field display name
   */
  getFieldName(fieldValue: string): string {
    return fieldValue;
  }

  /**
   * Track by function for templates
   */
  trackByTemplate(index: number, template: TemplateOption): string {
    return template.key || index.toString();
  }

  /**
   * Track by function for fields
   */
  trackByField(index: number, field: { key: string, value: string }): string {
    return field.value || index.toString();
  }

  /**
   * Track by function for categories
   */
  trackByCategory(index: number, cat: FieldCategory): string {
    return cat.id || index.toString();
  }

  // ============================================================================
  // #endregion UTILITY METHODS
  // ============================================================================

  // ============================================================================
  // #region MODAL FUNCTIONS (PLACEHOLDERS)
  // ============================================================================

  /**
   * Opens template gallery modal
   */
  openTemplateGallery() {
    // Implementation depends on your modal service
    console.log('Open template gallery');
  }

  /**
   * Opens field picker modal
   */
  openFieldPickerModal() {
    // Implementation depends on your modal service
    console.log('Open field picker modal');
  }

  // ============================================================================
  // #endregion MODAL FUNCTIONS (PLACEHOLDERS)
  // ============================================================================
}