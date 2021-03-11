import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  HostListener,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import * as CustomEditor from './ckeditor';

import { Bookmark } from './_models/rich-text.model';
import { UploadAdapter } from './upload-adapter';

@Component({
  selector: 'uc-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewInit {
  @ViewChild('ck', { static: false }) public instance: CKEditorComponent;

  @Input() public disabled: boolean;
  @Input() public readonly: boolean;
  @Input() public label: string;
  @Input() public parentForm: FormGroup;
  @Input() public controlName: string;
  @Input() public customClass: string;
  @Input() public enableHtmlEdit: boolean;
  @Input() public enableTableEdit: boolean;
  @Input() public enableHelpLink: boolean;
  @Input() public bookmarks: Bookmark[] = [];
  @Input() public bookmarksLoaded: boolean;

  @Output() public showHTMLLinkModal: EventEmitter<boolean> = new EventEmitter();

  @HostListener('window: showHelpModal')
  public triggerShowHelpModal(): void {
    this.showHTMLLinkModal.emit(true);
  }

  private headingButtons = ['heading', 'fontFamily'];
  private textStyleButtons = ['bold', 'italic', 'underline', 'fontSize', 'fontColor'];
  private alignmentButtons = ['indent', 'outdent', 'alignment', 'numberedList', 'bulletedList'];
  private extraFeatureButtons = ['specialCharacters', 'blockQuote', 'horizontalLine', 'link', 'pageBreak', 'imageUpload'];
  private editButtons = ['undo', 'redo'];
  private toolbarConfig = [
    ...this.headingButtons,
    '|',
    ...this.textStyleButtons,
    '|',
    ...this.alignmentButtons,
    '|',
    ...this.extraFeatureButtons,
    '|',
    ...this.editButtons,
  ];

  public Editor = CustomEditor;
  public empty = false;
  public helpTagForm: FormGroup;
  public elementSelection: Element;
  public lang: string;
  public showEditor = true;
  public rteConfig = {
    placeholder: 'Enter some text',
    toolbar: [...this.toolbarConfig],
    language: 'en', // i18n later - no.js file in translations folder
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side', 'imageResize'],
    },
    ckfinder: {
      uploadUrl: 'test', // TODO configure correct URL once UC-18890 done
    },
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    mention: {
      feeds: [
        {
          marker: '@',
          minimumCharacters: 2,
          feed: this.getFeedItems.bind(this),
          itemRenderer: this.menuItemRenderer,
        },
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
    },
    fontFamily: {
      options: ['Verdana', 'Times New Roman', 'Poppins'],
    },
    fontColor: {
      colors: [
        {
          color: '#BDBEC1',
          label: 'Light Grey',
        },
        {
          color: '#000000',
          label: 'Black',
        },
        {
          color: 'hsl(229, 11%, 39%)',
          label: 'Primary Font Colour',
        },
        {
          color: 'hsl(233, 67%, 53%)',
          label: 'Primary Brand Colour',
        },
      ],
    },
    fontSize: {
      options: [
        this.generatePtSetting(9),
        this.generatePtSetting(10),
        this.generatePtSetting(11),
        this.generatePtSetting(12),
        this.generatePtSetting(14),
      ],
    },
  };

  public onChanged = (value: string): void => {};
  public onTouched = () => {};

  constructor(private readonly fb: FormBuilder, private readonly cd: ChangeDetectorRef) {}

  public ngOnChanges(): void {
    // add marker character to each bookmark
    if (this.bookmarksLoaded) {
      this.bookmarks.forEach((bookmark: Bookmark) => {
        bookmark.value = `@${bookmark.value}`; // value must start with the marker character
        bookmark.id = `@${bookmark.id}`; // id must start with the marker character
      });
    }

    // handle readonly
    if (this.readonly && this.instance && this.instance.editorInstance && !this.instance.editorInstance.getData()) {
      this.rteConfig.placeholder = 'No data';
      this.recreateEditor();
    }
  }

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    let changeRequired = false;
    if (this.enableHelpLink) {
      this.createHtmlTagForm();
      this.extraFeatureButtons.push('helpLink');
      this.rteConfig.toolbar = this.createToolbar();
      changeRequired = true;
    }
    if (this.enableHtmlEdit) {
      this.extraFeatureButtons.push('htmlEmbed');
      this.rteConfig.toolbar = this.createToolbar();
      changeRequired = true;
    }
    if (this.enableTableEdit) {
      this.extraFeatureButtons.push('insertTable');
      this.rteConfig.toolbar = this.createToolbar();
      changeRequired = true;
    }
    if (changeRequired) this.recreateEditor();
  }

  /**
   * Invoked once the editor is loaded
   */
  public onReady(eventData: any): void {
    eventData.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }

  /**
   * Set an HTML link
   * @param {string} link The link to insert
   */
  public setHtmlLink(link: string): void {
    const editorInstance = this.instance.editorInstance;
    const range = editorInstance.model.document.selection.getFirstRange();
    const htmlDP = editorInstance.data.processor;
    const viewFragment = htmlDP.toView(link);
    const modelFragment = editorInstance.data.toModel(viewFragment);

    editorInstance.model.insertContent(modelFragment, range);
  }

  /**
   * Allow parent form to write values to this control
   * @param {string} value The value to write
   */
  public writeValue(value: string): void {
    this.onChanged(value);
    this.onTouched();
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChanged = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Destroy the old editor instance and create a new one (to pick up new toolbar items)
   */
  private recreateEditor(): void {
    // hiding then showing destroys and recreates the RTE
    this.showEditor = false;
    this.cd.detectChanges();
    setTimeout(() => {
      this.showEditor = true;
    });
  }

  /**
   * Build the editor toolbar
   */
  private createToolbar(): string[] {
    return [
      ...this.headingButtons,
      '|',
      ...this.textStyleButtons,
      '|',
      ...this.alignmentButtons,
      '|',
      ...this.extraFeatureButtons,
      '|',
      ...this.editButtons,
    ];
  }

  /**
   * Create form used for help topic linking
   */
  private createHtmlTagForm(): void {
    this.helpTagForm = this.fb.group({
      helpTagRoute: [null],
    });
  }

  /**
   * Get the bookmarks into the mentions feed
   * @param {string} queryText The text typed into the editor to match bookmarks
   */
  private getFeedItems(queryText: string): Promise<Bookmark[]> {
    return new Promise((resolve) => {
      if (this.bookmarksLoaded) {
        const bookmarksToDisplay = this.bookmarks.filter((bookmark: Bookmark) => bookmark.value.includes(queryText));
        resolve(bookmarksToDisplay);
      }
    });
  }

  /**
   * Customise items in the mentions menu
   * @param {Bookmark} item Each item in the mentions autocomplete menu
   */
  private menuItemRenderer(item: Bookmark): HTMLElement {
    const itemElement = document.createElement('span');
    itemElement.classList.add('mention-list-item');
    itemElement.textContent = item.value;
    itemElement.id = item.id.toString();
    return itemElement;
  }

  /**
   * Allow font-sizes to be PT not PX
   */
  private generatePtSetting(size: number): any {
    return {
      model: size,
      title: size,
      view: {
        name: 'span',
        styles: {
          'font-size': `${size}pt`,
        },
      },
    };
  }
}
