import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-breadcrumbs',
  template: `
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
    <li class="breadcrumb-item"
        *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
        [ngClass]="{active: last}">
      <a *ngIf="!last" [routerLink]="(breadcrumb.url == '//' ? '/dashboard/' : breadcrumb.url )">{{breadcrumb.label.title}}</a>
      <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
    </li>
  </ng-template>`
})
export class AppBreadcrumbsComponent {
  breadcrumbs: Array<Object>;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
      url = '/';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;

        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            // console.log(routeSnapshot);  
            // if(routeSnapshot.data.title == "Home" && routeSnapshot.url.length == 0){
            //    url += '/dashboard' + routeSnapshot.url.map(segment => segment.path).join('/');
            // } else {
              url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            // }        
            // console.log(url);           

            this.breadcrumbs.push({
              label: route.snapshot.data,
              url:   url
            });

           //  console.log(this.breadcrumbs);  
            currentRoute = route;
          }
        });
      } while (currentRoute);
    });
  }
}
