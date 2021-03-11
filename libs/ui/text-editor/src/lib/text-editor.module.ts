import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RichTextEditorComponent } from './rich-text-editor.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RichTextEditorComponent],
  exports: [RichTextEditorComponent],
})
export class TextEditorModule {}
