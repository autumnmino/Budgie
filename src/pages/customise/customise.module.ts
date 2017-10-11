import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomisePage } from './customise';

@NgModule({
  declarations: [
    CustomisePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomisePage),
  ],
})
export class CustomisePageModule {}
