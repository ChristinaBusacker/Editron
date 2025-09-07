import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsInputEditorComponent } from '../cms-input-editor/cms-input-editor.component';
import { CmsAssetEditorComponent } from '../cms-asset-editor/cms-asset-editor.component';
import { CmsColorEditorComponent } from '../cms-color-editor/cms-color-editor.component';
import { CmsDatetimeEditorComponent } from '../cms-datetime-editor/cms-datetime-editor.component';
import { CmsGeolocationEditorComponent } from '../cms-geolocation-editor/cms-geolocation-editor.component';
import { CmsHtmlEditorComponent } from '../cms-html-editor/cms-html-editor.component';
import { CmsJsonEditorComponent } from '../cms-json-editor/cms-json-editor.component';
import { CmsRichtextEditorComponent } from '../cms-richtext-editor/cms-richtext-editor.component';
import { CmsTagEditorComponent } from '../cms-tag-editor/cms-tag-editor.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CmsRelationEditorComponent } from '../cms-relation-editor/cms-relation-editor.component';
import { Project } from '@frontend/shared/services/api/models/project.model';

@Component({
  selector: 'lib-cms-form-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CmsInputEditorComponent,
    CmsRichtextEditorComponent,
    CmsGeolocationEditorComponent,
    CmsDatetimeEditorComponent,
    CmsHtmlEditorComponent,
    CmsColorEditorComponent,
    CmsJsonEditorComponent,
    CmsTagEditorComponent,
    CmsAssetEditorComponent,
    MatCheckboxModule,
    CmsRelationEditorComponent,
  ],
  templateUrl: './cms-form-field.component.html',
  styleUrl: './cms-form-field.component.scss',
})
export class CmsFormFieldComponent {
  @Input({ required: true }) field!: FieldDefinition;
  @Input({ required: true }) form!: FormGroup;
  @Input() languages: string[] = [];
  @Input() project: Project;

  getControl(fieldName: string): FormControl {
    return this.form.get(fieldName) as FormControl;
  }

  getControlInGroup(groupName: string, language: string): FormControl {
    return (this.form.get(groupName) as FormGroup)?.get(
      language,
    ) as FormControl;
  }
}
