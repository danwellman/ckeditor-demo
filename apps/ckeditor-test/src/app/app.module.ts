import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TextEditorModule } from '@demo/ui/text-editor';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TextEditorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
