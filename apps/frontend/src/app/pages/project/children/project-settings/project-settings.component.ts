import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthState } from '@frontend/core/store/auth/auth.state';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { CreateProject } from '@frontend/core/store/project/project.actions';
import { AdminWrapperComponent } from '@frontend/shared/components/admin-wrapper/admin-wrapper.component';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import {
  LanguageDefinition,
  LANGUAGES,
  ProjectSettings,
} from '@shared/declarations/interfaces/project/project-settings';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-project-settings',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CdkDropList,
    CdkDrag,
    MatSelectModule,
    MatExpansionModule,
    CommonModule,
  ],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss',
})
export class ProjectSettingsComponent implements OnInit {
  name = signal('');
  nameTouched = signal(false);

  activePanel = signal('modules');

  availableModules: Array<CmsModule> = [];
  selectedModules: Array<CmsModule> = [];
  modulesInit = false;

  languages = [...LANGUAGES];
  selectedLangauges = [];
  defaultLanguage: string;

  project?: Project;

  isAdmin = this.store.select(AuthState.isAdmin);

  constructor(private store: Store) {}

  get nameValid(): boolean {
    return this.name().trim().length >= 3;
  }

  get nameInvalid(): boolean {
    return this.nameTouched() && !this.nameValid;
  }

  getSettings(): ProjectSettings {
    return {
      languages: this.selectedLangauges.map(lang => lang.isoCode),
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

  initProjectLanguage(settings: ProjectSettings) {
    const selectedLanguages = this.languages.filter(lang =>
      this.project.settings.languages.includes(lang.locale),
    );
    this.selectedLangauges = [...this.selectedLangauges, ...selectedLanguages];
    this.languages = this.languages.filter(
      lang => !selectedLanguages.includes(lang),
    );

    this.defaultLanguage = settings.defaultLanguage;
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(CmsModuleState.cmsModules),
      this.store.select(NavigationState.currentProject),
    ])
      .pipe(
        map(([modules, project]) => {
          this.project = project;
          this.name.set(this.project.name);

          this.initProjectLanguage(project.settings);

          if (!this.modulesInit) {
            const availableModules = [...modules];
            const selectedModules = availableModules.filter(module =>
              project.settings.modules.includes(module.slug),
            );
            this.selectedModules = selectedModules;
            this.availableModules = availableModules.filter(
              module => !selectedModules.includes(module),
            );
            this.modulesInit = true;
          }
        }),
      )
      .subscribe();
  }
}
