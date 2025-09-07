/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  ViewChild,
  AfterViewInit,
  inject, OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';

import { UserBadgeDirective } from '@frontend/core/directives/user-badge.directive';
import { FormatDateDirective } from '@frontend/core/directives/format-date.directive';
import { LanguageService } from '@frontend/core/services/language/language.service';

import { tableDisplayTypes } from '@shared/constants/table-display-types.const';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CmsModule } from '@editron/common/cmsmodules/src/modules/cms-module';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    UserBadgeDirective,
    FormatDateDirective,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
})
export class ItemTableComponent implements AfterViewInit, OnInit {
  @Input({ required: true }) entries!: Observable<any[]>;
  @Input({ required: true }) module!: Observable<CmsModule>;
  @Input({ required: true }) selectedItemsSignal!: WritableSignal<Set<any>>;
  @Output() idClicked = new EventEmitter<string>();
  @Output() onDuplicate = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private store = inject(Store);
  private languageService = inject(LanguageService);

  schemas = this.store.select(CmsModuleState.schemas);
  schema?: ContentSchemaDefinition;
  items: any[] = [];

  displayedColumns: string[] = ['select', 'user', 'date', 'status', 'controls'];
  displayTypes = tableDisplayTypes;

  dataSource = new MatTableDataSource<any>();
  searchControl = new FormControl('');
  filteredOptions: any[] = [];

  ngOnInit(): void {
    combineLatest([this.entries, this.module, this.schemas])
      .pipe(
        map(([entries, module, schemas]) => {
          if (entries && module) {
            this.schema = schemas[module.slug];
            this.items = entries[module.slug];
            this.dataSource.data = this.items ?? [];
            this.filteredOptions = this.items ?? [];
            let columns = [];

            if (this.schema) {
              columns = [...(this.schema.fields || [])]
                .filter(
                  field =>
                    this.displayTypes.includes(field.type) || field.isTitle,
                )
                .sort((a, b) => {
                  if (a.isTitle === b.isTitle) return 0;
                  return a.isTitle ? -1 : 1;
                })
                .map(field => 'custom' + field.name);
            }

            this.displayedColumns = [
              'select',
              ...columns,
              'user',
              'date',
              'status',
              'controls',
            ];

            this.searchControl.valueChanges.subscribe(value => {
              const filtered = this.items.filter(item => {
                return JSON.stringify(item).includes(value);
              });
              this.filteredOptions = this.items ?? [];
              this.dataSource.data = filtered;
            });
          }
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'user') {
        return item.updatedBy?.name || '';
      }

      if (property === 'date') {
        return new Date(item.updatedAt).getTime();
      }

      if (property.startsWith('custom')) {
        const fieldName = property.replace('custom', '');
        const value = item.content?.[fieldName];
        if (typeof value === 'object') {
          return value?.[this.languageService.language()] ?? '';
        }
        return value ?? '';
      }

      return item[property];
    };
  }

  idClick(id: string) {
    this.idClicked.emit(id);
  }

  getContrastColor(hex: string): string {
    if (!hex) return '#000';
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  readFieldValue(field: FieldDefinition, element: any) {
    const content = element.content[field.name];
    if (typeof content === 'object') {
      const language = this.languageService.language();
      const locKeys = Object.keys(content);
      const key = locKeys.find(key => key.includes(language)) || locKeys[0];
      return content[key];
    }
    return content;
  }

  toggleSelection(item: any) {
    const updated = new Set(this.selectedItemsSignal());
    updated.has(item.id) ? updated.delete(item.id) : updated.add(item.id);
    this.selectedItemsSignal.set(updated);
  }

  isSelected(item: any): boolean {
    return this.selectedItemsSignal().has(item.id);
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      const allIds = this.dataSource.data.map(i => i.id);
      this.selectedItemsSignal.set(new Set(allIds));
    } else {
      this.selectedItemsSignal.set(new Set());
    }
  }

  isAllSelected(): boolean {
    const currentSelection = this.selectedItemsSignal();
    return (
      this.dataSource.data.length > 0 &&
      this.dataSource.data.every(i => currentSelection.has(i.id))
    );
  }
}
