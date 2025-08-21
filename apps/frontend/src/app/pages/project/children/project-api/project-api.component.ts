import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '@frontend/core/services/language/language.service';
import { NavigationState } from '@frontend/core/store/navigation/navigation.state';
import { ContentApiService } from '@frontend/shared/services/api/content-api.service';
import { Store } from '@ngxs/store';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import {
  CreateApiTokens,
  FetchApiTokens,
  DeleteApiTokens,
} from '@frontend/core/store/project/project.actions';
import { ProjectState } from '@frontend/core/store/project/project.state';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CopyToClipboardDirective } from '@frontend/core/directives/copy-to-clipboard.directive';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';

@Component({
  selector: 'app-project-api',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    CopyToClipboardDirective,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './project-api.component.html',
  styleUrl: './project-api.component.scss',
})
export class ProjectApiComponent implements OnInit, OnDestroy {
  store = inject(Store);
  languageService = inject(LanguageService);
  contentService = inject(ContentApiService);
  dialogService = inject(DialogService);
  fb = inject(FormBuilder);

  projectId: string;

  project = this.store.select(NavigationState.currentProject).pipe(
    map(project => {
      this.store.dispatch(new FetchApiTokens(project.id));
      this.projectId = project.id;
      return project;
    }),
  );

  apiTokens = this.store.select(ProjectState.apiTokens);

  subscription = new Subscription();

  apiKeyForm: FormGroup = this.fb.group({
    hasManagementAccess: [false],
    hasReadAccess: [false],
    hasWriteAccess: [false],
  });

  createApiKey() {
    this.store.dispatch(
      new CreateApiTokens({
        project: this.projectId,
        ...this.apiKeyForm.value,
      }),
    );
  }

  deleteToken(tokenId: string) {
    this.dialogService
      .openConfirmDialog({
        title: 'Do you want to delete this Api Token?',
        message: 'You cannot revert the changes.',
      })
      .afterClosed()
      .subscribe(response => {
        if (response.action === 'confirm') {
          this.store.dispatch(
            new DeleteApiTokens({
              tokenId,
              projectId: this.projectId,
            }),
          );
        }
      });
  }

  ngOnInit(): void {
    this.subscription.add(this.project.pipe(map(() => {})).subscribe());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
