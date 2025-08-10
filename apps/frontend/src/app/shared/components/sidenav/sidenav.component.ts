import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { ProjectState } from '@frontend/core/store/project/project.state';
import { Store } from '@ngxs/store';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  public project = this.store.select(NavigationState.currentProject);
  public modules = this.store.select(CmsModuleState.cmsModules);
  public binEntries = this.store.select(ProjectState.binEntries);

  public binEntryCount = 0;

  public projectModules = combineLatest([this.project, this.modules]).pipe(
    map(([project, modules]) => {
      return modules.filter(m => project.settings.modules.includes(m.slug));
    }),
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.project, this.binEntries])
      .pipe(
        map(([project, binEntries]) => {
          this.binEntryCount = binEntries[project.id].length;
        }),
      )
      .subscribe();
  }
}
