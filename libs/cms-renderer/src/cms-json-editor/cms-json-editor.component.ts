import { CodeEditor } from '@acrodata/code-editor';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { json } from '@codemirror/lang-json';

@Component({
  selector: 'lib-cms-json-editor',
  imports: [ReactiveFormsModule, FormsModule, CodeEditor],
  templateUrl: './cms-json-editor.component.html',
  styleUrl: './cms-json-editor.component.scss',
})
export class CmsJsonEditorComponent implements OnInit {
  @Input() control: FormControl<string>;

  value = `{
    "name": "Beispiel",
    "enabled": true
  }`;

  jsonExtension = json();

  onChange(value: string) {
    this.control.setValue(value);
  }

  ngOnInit(): void {
    this.value = this.control.value || '';
  }
}
