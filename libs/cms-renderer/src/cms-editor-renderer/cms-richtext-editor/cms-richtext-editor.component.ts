import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'lib-cms-richtext-editor',
  imports: [ReactiveFormsModule, QuillModule],
  templateUrl: './cms-richtext-editor.component.html',
  styleUrl: './cms-richtext-editor.component.scss',
})
export class CmsRichtextEditorComponent implements OnInit {
  @Input({ required: true }) control!: FormControl;

  modules: any;

  ngOnInit() {
    this.modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'link'],
          ['blockquote', 'code-block'],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],

          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],
          ['cmsAsset'],
        ],
        handlers: {
          cmsAsset: () => this.onInsertAsset(),
        },
      },
    };
  }

  onEditorCreated(quill: any) {}

  onInsertAsset() {}
}
