import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RelationPickerDialogData } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { DialogComponent } from '../../dialog.component';
import { ItemTableComponent } from '@frontend/shared/components/item-table/item-table.component';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { ContentState } from '@frontend/core/store/content/content.state';
import { FetchModuleEntries } from '@frontend/core/store/content/content.actions';

@Component({
  selector: 'app-relation-picker-dialog',
  imports: [DialogComponent, CommonModule, ItemTableComponent],
  templateUrl: './relation-picker-dialog.component.html',
  styleUrl: './relation-picker-dialog.component.scss',
})
export class RelationPickerComponent implements OnInit {
  public dialogData: RelationPickerDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RelationPickerComponent>);
  public entries = this.store.select(ContentState.entries);

  public module = this.store.select(NavigationState.cmsModule);
  public selectedItemsSignal = signal<Set<any>>(
    new Set<any>(this.dialogData.currentValue),
  );

  constructor(
    public api: ContentApiService,
    private store: Store,
  ) {}

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      return this.selectRelations();
    }

    this.dialogRef.close({ action });
  }

  selectRelations() {
    this.dialogRef.close({
      action: 'confirm',
      data: this.selectedItemsSignal(),
    });
  }

  ngOnInit(): void {
    this.module.pipe(
      map(module => {
        this.store.dispatch(
          new FetchModuleEntries(this.dialogData.projectId, module.slug),
        );
      }),
    );
  }
}
