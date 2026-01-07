import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AddBook } from './admin/add-book/add-book';
import { Login } from './login/login';
import { UserLayout } from './user-layout/user-layout';
import { Admin } from './admin/admin';
import { UserProfile } from './user-profile/user-profile';
import { register } from 'module';
import { Register } from './register/register';
import { Members } from './members/members';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register},

  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', component: Dashboard },   // /admin
      { path: 'books', component: AddBook },
      { path: 'members', component: Members } 
    ]
  },

  {
    path: 'users/:id',
    component: UserLayout,
    
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
