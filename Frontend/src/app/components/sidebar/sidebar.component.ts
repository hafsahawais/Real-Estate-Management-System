import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from "../../services/login.service";

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/project-list', title: 'Projects',  icon:'ni-planet text-blue', class: '' },
    { path: '/properties', title: 'Properties',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/complaints', title: 'Complaints',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private ls : LoginService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout() {
    this.ls.logOut()
  }
}
