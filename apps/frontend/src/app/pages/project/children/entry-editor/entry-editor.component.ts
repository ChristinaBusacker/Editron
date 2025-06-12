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
@Component({
  selector: 'app-entry-editor',
  imports: [CommonModule, CmsFormComponent, MatExpansionModule],
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.scss',
})
export class EntryEditorComponent implements OnInit {
  schemas = this.store.select(CmsModuleState.schemas);
  module = this.store.select(NavigationState.cmsModule);

  schema: ContentSchemaDefinition;

  extensions: Array<CmsModule>;
  name: string = '';
  renderer: string;

  activePanel = signal('');

  readonly panelOpenState = signal(false);

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.schemas, this.module])
      .pipe(
        map(([schemas, module]) => {
          if (schemas && module) {
            this.schema = schemas[module.slug];
            this.renderer = module.renderer;
            this.extensions = module.extensions;
            this.name = module.name;
            this.activePanel.set('main');
          }
        }),
      )
      .subscribe();
  }
}
