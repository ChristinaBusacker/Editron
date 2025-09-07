import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const components = []

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule
  ],
  exports: [...components]
})
export class CmsFrontendRendererModule { }
