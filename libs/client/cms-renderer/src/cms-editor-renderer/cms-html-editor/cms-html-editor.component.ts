import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class CmsHtmlEditorComponent implements OnInit {
  @Input() control: FormControl<string>;
  value = ``;
  extensions = [html(), javascript()];

  onChange(value: string) {
    this.control.setValue(value);
  }

  ngOnInit(): void {
    this.value = this.control.value || '';
  }
}
