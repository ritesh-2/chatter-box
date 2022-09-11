import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatMenuModule} from '@angular/material/menu'
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';

const material =[
  BrowserAnimationsModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatListModule,
  MatDividerModule
  
]


@NgModule({
  declarations: [],
  imports: [
   material
  ],
  exports:[
    material
  ]
})
export class MaterialModule { }
