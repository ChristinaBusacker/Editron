import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormatDateDirective } from '@frontend/core/directives/format-date.directive';
import { UserBadgeDirective } from '@frontend/core/directives/user-badge.directive';
import { LanguageService } from '@frontend/core/services/language/language.service';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { ProjectState } from '@frontend/core/store/project/project.state';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Store } from '@ngxs/store';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-project-bin',
  imports: [
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
  ],
  templateUrl: './project-bin.component.html',
  styleUrl: './project-bin.component.scss',
})
export class ProjectBinComponent implements OnInit, AfterViewInit {
  store = inject(Store);
  languageService = inject(LanguageService);
  contentService = inject(ContentApiService);

  binEntries = this.store.select(ProjectState.binEntries);
  schemas = this.store.select(CmsModuleState.schemas);
  project = this.store.select(NavigationState.currentProject);
  selectedItemsSignal = signal<Set<string>>(new Set());

  projectId: string;

  displayedColumns: string[] = ['select', 'id', 'controls'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  items: any[] = [];

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

  deleteEntry() {}

  restore() {}

  ngOnInit(): void {
    combineLatest([this.binEntries, this.schemas, this.project])
      .pipe(
        map(([entries, schemas, project]) => {
          this.projectId = project.id;
          if (entries) {
            this.items = entries[project.id];
            this.dataSource.data = this.items ?? [];
            this.filteredOptions = this.items ?? [];
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
}
