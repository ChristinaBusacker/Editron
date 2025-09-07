import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from './children/create-project-dialog/create-project-dialog.component';
import { AssetPickerDialogComponent } from './children/asset-picker-dialog/asset-picker-dialog.component';
import {
  ConfirmDialogData,
  RelationPickerDialogData,
} from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { ConfirmDialogComponent } from './children/confirm-dialog/confirm-dialog.component';
import { ConfirmDeleteDialogComponent } from './children/confirm-delete-dialog/confirm-delete-dialog.component';
import { RelationPickerComponent } from './children/relation-picker-dialog/relation-picker-dialog.component';

import { HomepageEditorColumnDialogComponent } from './children/homepage-editor-dialogs/homepage-editor-column-dialog/homepage-editor-column-dialog.component';
import { HomepageEditorRowDialogComponent } from './children/homepage-editor-dialogs/homepage-editor-row-dialog/homepage-editor-row-dialog.component';
import { HomepageEditorSectionDialogComponent } from './children/homepage-editor-dialogs/homepage-editor-section-dialog/homepage-editor-section-dialog.component';
import { HomepageEditorComponentTextDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-text-dialog/homepage-editor-component-text-dialog.component';
import { HomepageEditorComponentImageDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-image-dialog/homepage-editor-component-image-dialog.component';
import { HomepageEditorComponentVideoDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-video-dialog/homepage-editor-component-video-dialog.component';
import { HomepageEditorComponentButtonDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-button-dialog/homepage-editor-component-button-dialog.component';
import { HomepageEditorComponentCarouselDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-carousel-dialog/homepage-editor-component-carousel-dialog.component';
import { HomepageEditorComponentFormDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-form-dialog/homepage-editor-component-form-dialog.component';
import { HomepageEditorComponentGaleryDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-galery-dialog/homepage-editor-component-galery-dialog.component';
import { HomepageEditorComponentMapDialogComponent } from './children/homepage-editor-dialogs/components/homepage-editor-component-map-dialog/homepage-editor-component-map-dialog.component';
import {
  Section,
  Row,
  Column,
  ComponentInstance,
} from '@editron/common/cmsmodules/src/modules/homepage/declarations/component.declaration';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly matDialog: MatDialog) {}

  openCreateProjectDialog() {
    return this.matDialog.open(CreateProjectDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
    });
  }

  openAssetPickerDialog(data: {
    multiSelect: boolean;
    value: string | string[];
  }) {
    return this.matDialog.open(AssetPickerDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openRelationPickerDialog(data: RelationPickerDialogData) {
    return this.matDialog.open(RelationPickerComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openConfirmDialog(data: ConfirmDialogData) {
    return this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openConfirmDeleteDialog(data: ConfirmDialogData) {
    return this.matDialog.open(ConfirmDeleteDialogComponent, {
      maxWidth: '400px',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openHomepageEditorSectionDialog(data: Section) {
    return this.matDialog.open(HomepageEditorSectionDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openHomepageEditorRowDialog(data: Row) {
    return this.matDialog.open(HomepageEditorRowDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openHomepageEditorColumnDialog(data: Column) {
    return this.matDialog.open(HomepageEditorColumnDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openHomepageEditorComponentDialog(data: {
    component: ComponentInstance;
    languages: string[];
  }) {
    const dialogComponent = this.getComponentDialog(data.component.type);

    return this.matDialog.open(dialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getComponentDialog(type: string): any {
    switch (type) {
      case 'text':
        return HomepageEditorComponentTextDialogComponent;
      case 'image':
        return HomepageEditorComponentImageDialogComponent;
      case 'video':
        return HomepageEditorComponentVideoDialogComponent;
      case 'button':
        return HomepageEditorComponentButtonDialogComponent;
      case 'form':
        return HomepageEditorComponentFormDialogComponent;
      case 'carousel':
        return HomepageEditorComponentCarouselDialogComponent;
      case 'galery':
        return HomepageEditorComponentGaleryDialogComponent;
      case 'map':
        return HomepageEditorComponentMapDialogComponent;
      // Add more cases as needed
      default:
        throw new Error(`Unknown component dialog type: ${type}`);
    }
  }
}
