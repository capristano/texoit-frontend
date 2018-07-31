import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {ToolbarModule} from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';

import { ConfirmationService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ListComponent } from './list/list.component';
import { RegisterComponent } from './register/register.component';
import { ProductService } from './product.service';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToolbarModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    PanelModule,
    InputSwitchModule,
    CalendarModule,
    KeyFilterModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    InputMaskModule,
    DataViewModule,
    TableModule
  ],
  providers: [
    ProductService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
