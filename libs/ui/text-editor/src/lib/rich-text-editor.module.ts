import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { RichTextEditorComponent } from './rich-text-editor.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule],
  declarations: [RichTextEditorComponent],
  exports: [RichTextEditorComponent],
})
export class RichTextEditorModule {}
