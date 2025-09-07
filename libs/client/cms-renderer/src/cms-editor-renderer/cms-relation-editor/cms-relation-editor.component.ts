import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogResponse } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { LanguageService } from '@frontend/core/services/language/language.service';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { ContentState } from '@frontend/core/store/content/content.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { Store } from '@ngxs/store';
import { tableDisplayTypes } from '@shared/constants/table-display-types.const';
import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';
import { combineLatest, map } from 'rxjs';
@Component({
  selector: 'lib-cms-relation-editor',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './cms-relation-editor.component.html',
  styleUrl: './cms-relation-editor.component.scss',
})
export class CmsRelationEditorComponent implements OnInit {
  @Input() control: FormControl;
  @Input() field: FieldDefinition;
  @Input() projectId: string;
  @Input() label = 'RelationPicker';

  public entries = this.store.select(ContentState.entries);
  public module = this.store.select(NavigationState.cmsModule);
  public schemas = this.store.select(CmsModuleState.schemas);
  storedEntries: any[] = [];

  selectedRelationIds: Array<string> = [];
  selectedRelations: any[] = [];

  displayTypes = tableDisplayTypes;
  fieldsShown: string[] = [];
  displayFields: string[] = [];
  displayFieldCount = 3;

  constructor(
    private dialogService: DialogService,
    private store: Store,
    private languageService: LanguageService,
  ) {}

  openRelationPicker() {
    this.dialogService
      .openRelationPickerDialog({
        field: this.field,
        projectId: this.projectId,
        currentValue: this.control.value,
      })
      .afterClosed()
      .subscribe((result: DialogResponse<Set<string>>) => {
        if (result.action === 'confirm') {
          this.selectedRelationIds = Array.from(result.data);
          this.control.patchValue(this.selectedRelationIds);
          this.mapRelations();
        }
      });
  }

  openEditDialog() {}

  removeRelation(relation) {
    this.selectedRelationIds = this.selectedRelationIds.filter(
      id => id !== relation.id,
    );

    this.control.patchValue(this.selectedRelationIds);

    this.mapRelations();
  }

  mapRelations() {
    this.selectedRelations = this.storedEntries.filter(entry => {
      return this.selectedRelationIds.includes(entry.id);
    });
  }

  getDisplayFieldsFromModule(schema: ContentSchemaDefinition) {
    const titleFields = schema.fields
      .filter(field => field.isTitle)
      .map(field => field.name);

    if (titleFields.length < 2) {
      const fillCount = this.displayFieldCount - titleFields.length;
      const fields = schema.fields
        .filter(field => {
          const a = this.displayTypes.includes(field.type);
          const b = !titleFields.includes(field.name);
          return a && b;
        })
        .map(field => field.name)
        .slice(0, fillCount);

      return [...titleFields, ...fields];
    }

    return titleFields;
  }

  readFieldValue(key: string, element: any) {
    const content = element.content[key];
    if (typeof content === 'object') {
      const language = this.languageService.language();
      const locKeys = Object.keys(content);
      const key = locKeys.find(key => key.includes(language)) || locKeys[0];
      return content[key];
    }
    return content;
  }

  ngOnInit(): void {
    if (this.control.value) {
      this.selectedRelationIds = this.control.value;
    }

    combineLatest([this.entries, this.module, this.schemas])
      .pipe(
        map(([entries, module, schemas]) => {
          this.storedEntries = entries[module.slug] || [];
          const schema = schemas[module.slug];
          this.displayFields = this.getDisplayFieldsFromModule(schema);
          this.mapRelations();
          console.log(this.displayFields);
        }),
      )
      .subscribe();
  }
}
