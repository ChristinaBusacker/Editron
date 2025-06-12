import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CodeEditor } from '@acrodata/code-editor';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';

@Component({
  selector: 'lib-cms-html-editor',
  imports: [ReactiveFormsModule, FormsModule, MatInputModule, CodeEditor],
  templateUrl: './cms-html-editor.component.html',
  styleUrl: './cms-html-editor.component.scss',
})
export class CmsHtmlEditorComponent {
  value = `<div>Hello World</div>`;
  extensions = [html(), javascript()];
}
