import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { PlotComponent } from './plot/plot.component';
import { NgChartsModule } from 'ng2-charts';
import { InputMenuComponent } from './input-menu/input-menu.component';
import { HeaderComponent } from './header/header.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VisualizeComponent } from './visualize/visualize.component';

@NgModule({
  declarations: [
    AppComponent,
    PlotComponent,
    InputMenuComponent,
    HeaderComponent,
    VisualizeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
