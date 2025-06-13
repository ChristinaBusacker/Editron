import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CmsFormComponent } from '@cmsrenderer/cms-editor-renderer/cms-form/cms-form.component';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { combineLatest, map } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { CreateEntry } from '@frontend/core/store/content/content.actions';
import { Project } from '@frontend/shared/services/api/models/project.model';
@Component({
  selector: 'app-entry-editor',
  imports: [CommonModule, CmsFormComponent, MatExpansionModule],
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.scss',
})
export class EntryEditorComponent implements OnInit {
  schemas = this.store.select(CmsModuleState.schemas);
  module = this.store.select(NavigationState.cmsModule);
  project = this.store.select(NavigationState.currentProject);

  schema: ContentSchemaDefinition;
  currentModule: CmsModule;

  formGroups: { [key: string]: FormGroup } = {};

  renderer: string;

  currentProject!: Project;

  activePanel = signal('');

  readonly panelOpenState = signal(false);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private contentService: ContentApiService,
  ) {}

  setFormGroup(slug: string) {
    if (!this.formGroups[slug]) {
      this.formGroups[slug] = this.fb.group({});
      console.log(this.formGroups);
    }
  }

  getFormGroup(slug: string) {
    return this.formGroups[slug];
  }

  initFormGroups() {
    this.setFormGroup(this.currentModule.slug);
    this.currentModule.extensions.forEach(ext => this.setFormGroup(ext.slug));
  }

  logValues() {
    const values = this.getFormGroup(this.currentModule.slug).value;
    Object.keys(this.formGroups).forEach(key => {
      if (key !== this.currentModule.slug) {
        values[key] = this.formGroups[key].value;
      }
    });
    console.log(values);

    this.store.dispatch(
      new CreateEntry(this.currentProject.id, this.currentModule.slug),
    );
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
          }
        }),
      )
      .subscribe();
  }
}
