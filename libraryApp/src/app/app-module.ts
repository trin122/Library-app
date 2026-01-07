import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Admin } from './admin/admin';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Sidebar } from './admin/sidebar/sidebar';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { UserLayout } from './user-layout/user-layout';
import { UserProfile } from './user-profile/user-profile';
import { UserBooks } from './user-books/user-books';
import { UserBorrowList } from './user-borrow-list/user-borrow-list';
import { SidebarUser } from './sidebar-user/sidebar-user';
import { AddBook } from './admin/add-book/add-book';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Register } from './register/register';
import { Members } from './members/members';


@NgModule({
  declarations: [
    App,
    Admin,
    Header,
    Footer,
    Sidebar,
    Dashboard,
    Signup,
    UserLayout,
    UserBooks,
    UserBorrowList,
    SidebarUser,
    UserLayout,
    Register,
    Members,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     FormsModule,
    HttpClientModule,
    AddBook,
    Login,
    UserProfile
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
