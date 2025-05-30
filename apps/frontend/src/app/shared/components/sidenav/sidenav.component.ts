import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  public project = this.store.select(NavigationState.currentProject);
  public modules = this.store.select(CmsModuleState.cmsModules);

  constructor(private store: Store) {}
}
