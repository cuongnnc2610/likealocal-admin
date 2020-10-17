import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent,EmailInputComponent,ResetPwdComponent } from './views/auths-management';

import { AuthGuard } from './_helpers/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // {
  //   path: '',
  //   redirectTo: 'order-management',
  //   pathMatch: 'full',
  // },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'reset-password',
    component: ResetPwdComponent,
    data: {
      title: 'Reset Password'
    }
  },
  {
    path: 'email-input',
    component: EmailInputComponent,
    data: {
      title: 'Input Email Address'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/dashboard/index.module').then(m => m.IndexModule)
      },
      {
        path: 'users-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/users-management/base.module').then(m => m.BaseModule)
      },
      {
        path: 'order-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/orders-management/index/index.module').then(m => m.IndexModule),
      },
      {
        path: 'order-management/detail',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/orders-management/detail/detail.module').then(m => m.DetailModule),
      },
      {
        path: 'user-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/users-management/index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'terms-of-use',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/terms-of-use/index.module').then(m => m.IndexModule)
      },
      {
        path: 'notice-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/notifications-management/index.module').then(m => m.IndexModule)
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/user/index.module').then(m => m.IndexModule)
      },
      {
        path: 'host-request',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/host-request/index.module').then(m => m.IndexModule)
      },
      {
        path: 'tour',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/tour/index.module').then(m => m.IndexModule)
      },
      {
        path: 'tours-review',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/tours-review/index.module').then(m => m.IndexModule)
      },
      {
        path: 'hosts-review',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/hosts-review/index.module').then(m => m.IndexModule)
      },
      {
        path: 'coupon',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/coupon/index.module').then(m => m.IndexModule)
      },
      {
        path: 'subscriber',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/subscriber/index.module').then(m => m.IndexModule)
      },
      {
        path: 'benefit',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/benefit/index.module').then(m => m.IndexModule)
      },
      {
        path: 'category',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/category/index.module').then(m => m.IndexModule)
      },
      {
        path: 'transport',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/transport/index.module').then(m => m.IndexModule)
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
