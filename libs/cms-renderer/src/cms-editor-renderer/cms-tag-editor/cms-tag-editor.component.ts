import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-cms-tag-editor',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './cms-tag-editor.component.html',
  styleUrl: './cms-tag-editor.component.scss',
})
export class CmsTagEditorComponent {}
