import { GroupComponent } from './components/group/group.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { PanelComponent } from './components/panel/panel.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'profile/:profileId',
    component: ProfileComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'panel',
    component: PanelComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'group',
    component: GroupComponent,
    ...canActivate(redirectToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
