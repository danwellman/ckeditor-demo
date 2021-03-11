// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

// import { TestingBed } from '@ucase/utils/testing';
// import { TranslateTestingModule } from '@ucase/utils/testing';
// import { RichTextEditorComponent } from './rich-text-editor.component';
// import { fakeEditor } from './_mocks/ckeditor.mock';

// TODO ckeditor5-angular cannot be tested until https://github.com/ckeditor/ckeditor5-angular/issues/217 is resolved
describe('RichTextEditorCkComponent', () => {
  // let component: RichTextEditorComponent;
  // let fixture: ComponentFixture<RichTextEditorComponent>;
  // const fakeFormControl = new FormControl(null);
  // const fakeForm = new FormGroup({
  //   fakeControl: fakeFormControl,
  // });

  it('should create', () => {
    expect(true).toEqual(true);
  });

  // TestingBed.configureTestingModule({
  //   imports: [ReactiveFormsModule, TranslateTestingModule, CKEditorModule],
  //   declarations: [RichTextEditorComponent],
  //   providers: [],
  // });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(RichTextEditorComponent);
  //   component = fixture.componentInstance;
  //   component.parentForm = fakeForm;
  //   component.controlName = 'fakeControl';

  //   fixture.detectChanges();
  // });

  // describe('triggerShowHelpModal()', () => {
  //   beforeEach(() => {
  //     spyOn(component.showHTMLLinkModal, 'emit');
  //   });

  //   it('emits the showHTMLLinkModal event', () => {
  //     component.triggerShowHelpModal();

  //     expect(component.showHTMLLinkModal.emit).toHaveBeenCalledWith(true);
  //   });
  // });

  // describe('ngOnChanges()', () => {
  //   describe('handling bookmarks', () => {
  //     it('prepends "@" to each bookmark', () => {
  //       component.bookmarksLoaded = true;
  //       component.bookmarks = [{ id: '1', value: 'test' }];

  //       component.ngOnChanges();

  //       expect(component.bookmarks[0].id).toEqual('@1');
  //       expect(component.bookmarks[0].value).toEqual('@test');
  //     });
  //   });

  //   describe('handling readonly', () => {
  //     beforeEach(() => {
  //       spyOn<any>(component, 'recreateEditor');

  //       component.instance = fakeEditor as unknown as CKEditorComponent;

  //       spyOn<any>(component.instance.editorInstance, 'getData').and.returnValue(null);
  //     });

  //     it('sets the placeholder and recreates the editor if it is readonly with no data', () => {
  //       component.bookmarksLoaded = false;
  //       component.rteConfig.placeholder = '';
  //       component.readonly = true;

  //       component.ngOnChanges();

  //       expect(component.rteConfig.placeholder).toEqual('no data');
  //       expect(component['recreateEditor']).toHaveBeenCalled();
  //     });
  //   });
  // });
});
