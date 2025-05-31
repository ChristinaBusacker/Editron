import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentState } from '@frontend/core/store/content/content.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-project-entity',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-entity.component.html',
  styleUrl: './project-entity.component.scss',
})
export class ProjectEntityComponent {
  project = this.store.select(NavigationState.currentProject);
  module = this.store.select(NavigationState.cmsModule);
  entries = this.store.select(ContentState.entries);
  constructor(private store: Store) {}
}
