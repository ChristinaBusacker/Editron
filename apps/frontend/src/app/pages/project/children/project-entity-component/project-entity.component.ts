import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContentState } from '@frontend/core/store/content/content.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ItemTableComponent } from '../../../../shared/components/item-table/item-table.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { FetchModuleEntries } from '@frontend/core/store/content/content.actions';
import { MatIconModule } from '@angular/material/icon';
import { FetchProjectList } from '@frontend/core/store/project/project.actions';

@Component({
  selector: 'app-project-entity',
  imports: [
    CommonModule,
    RouterModule,
    ItemTableComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './project-entity.component.html',
  styleUrl: './project-entity.component.scss',
})
export class ProjectEntityComponent implements OnInit {
  project = this.store.select(NavigationState.currentProject);
  module = this.store.select(NavigationState.cmsModule);
  entries = this.store.select(ContentState.entries);

  moduleEntries = new BehaviorSubject([]);

  selectedItemsSignal = signal<Set<any>>(new Set<any>());

  projectId: string;
  moduleSlug: string;

  constructor(
    private store: Store,
    private router: Router,
    private dialogService: DialogService,
    private contentApi: ContentApiService,
  ) {
    effect(() => {
      // External selection change
      const current = this.selectedItemsSignal();
    });
  }

  testDialog() {
    this.dialogService.openConfirmDeleteDialog({
      title: 'Are you sure?',
      message: 'Du bist dabei diese Einträge unwiederruflich zu löschen',
    });
  }

  duplicateEntry(entryId: string) {
    this.dialogService
      .openConfirmDialog({
        title: 'Do you want to duplicate this entry?',
        message:
          'All values will be duplicated. You should edit important fields like slug afterwards',
      })
      .afterClosed()
      .subscribe(response => {
        if (response.action === 'confirm') {
          this.contentApi.duplicate(entryId).subscribe(data => {
            if (data.id) {
              this.navigate2Editor(data.id);
            }
          });
        }
      });
  }

  deleteEntry(entryId: string) {
    this.dialogService
      .openConfirmDeleteDialog({
        title: 'Do you want to delete this entry?',
        message:
          'All values will be duplicated. You should edit important fields like slug afterwards',
      })
      .afterClosed()
      .subscribe(response => {
        if (response.action === 'confirm') {
          this.contentApi.deleteEntry(entryId).subscribe(data => {
            setTimeout(() => {
              this.store.dispatch(
                new FetchModuleEntries(this.projectId, this.moduleSlug),
              );
            }, 500);
          });
        }
      });
  }

  navigate2Editor(entityId = 'create') {
    this.router.navigate(['/', this.projectId, this.moduleSlug, entityId]);
  }

  ngOnInit(): void {
    combineLatest([this.entries, this.module, this.project])
      .pipe(
        map(([entries, module, project]) => {
          if (entries && module) {
            this.moduleSlug = module.slug;
            this.projectId = project.id;
            this.moduleEntries.next(entries[module.slug]);
          }
        }),
      )
      .subscribe();
  }
}
