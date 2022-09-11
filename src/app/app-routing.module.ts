import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';


const redirectToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectToHome = () => redirectLoggedInTo(['/home'])

const routes: Routes = [
  {
    path: '',pathMatch:'full', component: LandingPageComponent,
    ...canActivate(redirectToHome),
    ...canActivate(redirectToLogin)
    // Test commmit
  },
  {
    path: 'login', component: LoginComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'signup', component: SignupComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'home', component: HomeComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'profile', component: ProfileComponent,
    ...canActivate(redirectToLogin)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
