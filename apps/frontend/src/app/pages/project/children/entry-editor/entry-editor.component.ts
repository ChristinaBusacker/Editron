import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { ContentState } from '@frontend/core/store/content/content.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';
import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-entry-editor',
  imports: [CommonModule],
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.scss',
})
export class EntryEditorComponent implements OnInit {
  schemas = this.store.select(CmsModuleState.schemas);
  module = this.store.select(NavigationState.cmsModule);

  schema: ContentSchemaDefinition;

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.schemas, this.module])
      .pipe(
        map(([schemas, module]) => {
          if (schemas && module) {
            this.schema = schemas[module.slug];
          }
        }),
      )
      .subscribe();
  }
}
