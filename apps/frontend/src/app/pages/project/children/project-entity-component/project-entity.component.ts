import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentState } from '@frontend/core/store/content/content.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-project-entity',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-entity.component.html',
  styleUrl: './project-entity.component.scss',
})
export class ProjectEntityComponent implements OnInit {
  project = this.store.select(NavigationState.currentProject);
  module = this.store.select(NavigationState.cmsModule);
  entries = this.store.select(ContentState.entries);

  moduleEntries = new BehaviorSubject([]);

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.entries, this.module, this.project])
      .pipe(
        map(([entries, module, project]) => {
          if (entries && module) {
            this.moduleEntries.next(entries[module.slug]);
          }
        }),
      )
      .subscribe();
  }
}
