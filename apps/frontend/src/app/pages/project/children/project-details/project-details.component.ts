import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-project-details',
  imports: [RouterModule, CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  project = this.store.select(NavigationState.currentProject);

  constructor(private store: Store) {}
}
