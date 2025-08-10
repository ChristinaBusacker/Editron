import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CmsFormComponent } from '@cmsrenderer/cms-editor-renderer/cms-form/cms-form.component';
import { CmsHomepageEditorComponent } from '@cmsrenderer/cms-editor-renderer/cms-homepage-editor/cms-homepage-editor.component';
import { CopyToClipboardDirective } from '@frontend/core/directives/copy-to-clipboard.directive';
import { FormatDateDirective } from '@frontend/core/directives/format-date.directive';
import { UserBadgeDirective } from '@frontend/core/directives/user-badge.directive';
import { CanComponentDeactivate } from '@frontend/core/guards/unsaved-changes.guard';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { EntryDetails } from '@frontend/shared/services/api/models/content.model';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import {
  LanguageDefinition,
  LANGUAGES,
} from '@shared/declarations/interfaces/project/project-settings';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { combineLatest, map, switchMap } from 'rxjs';
@Component({
  selector: 'app-entry-editor',
  imports: [
    CommonModule,
    CmsFormComponent,
    MatExpansionModule,
    CopyToClipboardDirective,
    UserBadgeDirective,
    FormatDateDirective,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    CmsHomepageEditorComponent,
  ],
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.scss',
})
export class EntryEditorComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(CmsFormComponent) formComponent: CmsFormComponent;

  schemas = this.store.select(CmsModuleState.schemas);
  module = this.store.select(NavigationState.cmsModule);
  project = this.store.select(NavigationState.currentProject);

  schema: ContentSchemaDefinition;
  currentModule: CmsModule;

  formGroups: { [key: string]: FormGroup } = {};

  renderer: string;
  entryData?: EntryDetails;

  currentProject!: Project;
  projectLanguages!: Array<LanguageDefinition>;

  activePanel = signal('');

  readonly panelOpenState = signal(false);

  getActiveVersion() {
    const published = this.entryData.versions.find(v => v.isPublished);

    if (published) {
      return published;
    }

    return this.entryData.versions[this.entryData.versions.length - 1];
  }

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private contentService: ContentApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.entryData = this.route.snapshot.data['entry'] as EntryDetails;
  }

  setFormGroup(slug: string) {
    if (!this.formGroups[slug]) {
      this.formGroups[slug] = this.fb.group({});
    }
  }

  getFormGroup(slug: string) {
    return this.formGroups[slug];
  }

  getProjectLangauges() {
    return this.currentProject.settings.languages.map(lang =>
      LANGUAGES.find(obj => obj.isoCode === lang),
    );
  }

  updateEntry() {
    const values = this.getFormGroup(this.currentModule.slug).value;
    Object.keys(this.formGroups).forEach(key => {
      if (key !== this.currentModule.slug) {
        values[key] = this.formGroups[key].value;
      }
    });

    this.contentService
      .updateEntry(this.entryData.id, {
        data: values,
      })
      .pipe(
        switchMap(() => {
          return this.contentService.getEntryDetails(this.entryData.id);
        }),
        map(entryDetails => {
          this.entryData = entryDetails;
        }),
      )
      .subscribe();
  }

  initFormGroups() {
    this.setFormGroup(this.currentModule.slug);
    this.currentModule.extensions.forEach(ext => this.setFormGroup(ext.slug));
  }

  async createEntry() {
    const values = this.getFormGroup(this.currentModule.slug).value;
    Object.keys(this.formGroups).forEach(key => {
      if (key !== this.currentModule.slug) {
        values[key] = this.formGroups[key].value;
      }
    });

    this.contentService
      .createEntry(this.currentProject.id, this.currentModule.slug, {
        data: values,
      })
      .subscribe(data => {
        if (data.id) {
          this.router.navigate([
            this.currentProject.id,
            this.currentModule.slug,
            data.id,
          ]);
        }
      });
  }

  hasUnsavedChanges(): boolean {
    return this.formComponent?.hasUnsavedChanges();
  }

  ngOnInit(): void {
    combineLatest([this.schemas, this.module, this.project])
      .pipe(
        map(([schemas, module, project]) => {
          if (schemas && module) {
            this.schema = schemas[module.slug];
            this.renderer = module.renderer;
            this.currentProject = project;
            this.currentModule = module;
            this.activePanel.set('main');
            this.initFormGroups();
            this.projectLanguages = this.getProjectLangauges();
          }
        }),
      )
      .subscribe();
  }
}
