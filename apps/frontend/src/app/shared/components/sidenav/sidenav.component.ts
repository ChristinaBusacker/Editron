import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsModuleState } from '@frontend/core/store/cmsModules/project.state';
import { Store } from '@ngxs/store';
import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  public modules = this.store.select(CmsModuleState.cmsModules);

  constructor(private store: Store) {}
}
