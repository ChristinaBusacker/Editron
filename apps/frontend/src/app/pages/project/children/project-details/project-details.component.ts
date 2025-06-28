import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import {
  Project,
  ProjectStatistics,
} from '@frontend/shared/services/api/models/project.model';
import { ProjectApiService } from '@frontend/shared/services/api/project-api.service';
import { Store } from '@ngxs/store';
import { map, Observable, switchMap } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  buildCalendarHeatmap,
  HeatmapWeek,
} from '@frontend/core/utils/build-calender-heatmap.util';
import { UserBadgeDirective } from '@frontend/core/directives/user-badge.directive';
import { FormatDateDirective } from '@frontend/core/directives/format-date.directive';
import { AnimateNumberDirective } from '@frontend/core/directives/animate-number.directive';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-project-details',
  imports: [
    RouterModule,
    CommonModule,
    NgxChartsModule,
    UserBadgeDirective,
    FormatDateDirective,
    AnimateNumberDirective,
    MatButtonModule,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements AfterViewInit {
  project = this.store.select(NavigationState.currentProject);
  statistics?: Observable<ProjectStatistics>;

  projectId: string;

  showXAxis = true;
  showYAxis = true;

  heatmapData: HeatmapWeek[];

  entriesPerSchemaChartData: {
    name: string;
    value: number;
  }[];

  dataLabelFormatting = (value: number) => `${value} entries`;

  colorScheme = {
    domain: [
      '#E3F2FD', // very light blue
      '#BBDEFB', // light
      '#90CAF9', // medium
      '#42A5F5', // primary
      '#1E88E5', // bold
      '#1565C0', // darkest
    ],
  };

  constructor(
    private store: Store,
    private projectApi: ProjectApiService,
    private router: Router,
  ) {}

  navigate2Editor(moduleSlug, entityId = 'create') {
    this.router.navigate(['/', this.projectId, moduleSlug, entityId]);
  }

  ngAfterViewInit(): void {
    this.statistics = this.project.pipe(
      switchMap(project => {
        this.projectId = project.id;
        return this.projectApi.getStatistics(project.id);
      }),
      map(statistics => {
        this.heatmapData = buildCalendarHeatmap(statistics.changesByDate);

        this.entriesPerSchemaChartData = statistics.entriesPerSchema.map(
          entry => ({
            name: entry.schema,
            value: entry.count,
          }),
        );

        return statistics;
      }),
    );
  }
}
