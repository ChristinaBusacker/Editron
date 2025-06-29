import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateProject } from '@frontend/core/store/project/project.actions';
import { Store } from '@ngxs/store';
import { DialogComponent } from '../../dialog.component';
import {
  LANGUAGES,
  ProjectSettings,
} from '@shared/declarations/interfaces/project/project-settings';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { CommonModule } from '@angular/common';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    DialogComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CdkDropList,
    CdkDrag,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
})
export class CreateProjectDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);

  name = signal('');
  nameTouched = signal(false);

  activePanel = signal('');

  availableModules: Array<CmsModule> = [];
  selectedModules: Array<CmsModule> = [];
  modulesInit = false;

  languages = LANGUAGES;
  selectedLangauges = [this.languages.shift()];
  defaultLanguage = this.selectedLangauges[0].locale;

  constructor(private store: Store) {}

  get nameValid(): boolean {
    return this.name().trim().length >= 3;
  }

  get nameInvalid(): boolean {
    return this.nameTouched() && !this.nameValid;
  }

  getSettings(): ProjectSettings {
    return {
      languages: this.selectedLangauges.map(lang => lang.locale),
      defaultLanguage: this.defaultLanguage,
      modules: this.selectedModules.map(module => module.slug),
    };
  }

  listSelectedLanguages() {
    return this.selectedLangauges.map(lang => lang.name).join(', ');
  }

  listSelectedModules() {
    return this.selectedModules.map(lang => lang.name).join(', ');
  }

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      this.nameTouched.set(true);

      if (!this.nameValid) return;
      this.store
        .dispatch(
          new CreateProject({
            name: this.name(),
            settings: this.getSettings(),
          }),
        )
        .subscribe(() => {
          this.dialogRef.close({ action, data: { name: this.name() } });
        });
    } else {
      this.dialogRef.close({ action, data: {} });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    this.close('confirm');
  }

  @HostListener('document:keydown.esc', ['$event'])
  handleEscape(event: KeyboardEvent) {
    event.preventDefault();
    this.close('cancel');
  }

  ngOnInit(): void {
    this.store.select(CmsModuleState.cmsModules).subscribe(modules => {
      if (!this.modulesInit) {
        this.availableModules = [...modules];
        this.modulesInit = true;
      }
    });
  }
}
