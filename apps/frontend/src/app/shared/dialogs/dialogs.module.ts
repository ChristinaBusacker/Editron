import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatDialogModule],
  providers: [DialogService],
})
export class DialogsModule {}
