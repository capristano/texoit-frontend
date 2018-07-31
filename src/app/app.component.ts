import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
      {label: 'Listar', icon: 'fa fa-fw fa-search', routerLink: 'list' },
      {label: 'Cadastrar', icon: 'fa fa-fw fa-plus', routerLink: 'register'}
    ];

  }

  opa(): void{

  }
}
