import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterModule, MatExpansionModule, MatButtonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  public project = this.store.select(NavigationState.currentProject);
  public modules = this.store.select(CmsModuleState.cmsModules);

  public projectModules = combineLatest([this.project, this.modules]).pipe(
    map(([project, modules]) => {
      return modules.filter(m => project.settings.modules.includes(m.slug));
    }),
  );

  constructor(private store: Store) {}
}
