import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, of, take } from 'rxjs';
import { switchMap } from 'rxjs';
import { ChatConstant } from './models/constant';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatter-box';
  placeHolderImg = ChatConstant.PlaceHolder;
  user$ = this.userServ.currentUser$
 currentRoute:string;

  constructor(private authServcie: AuthenticationService,
    private userServ:UserService, private router:Router) {
//Fetching current route
      this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).pipe(switchMap((eve:any) => this.currentRoute = eve.url))
      .subscribe()

    }
 

  /**
  @name : LoginComponent.logOut()
  @description : Authenticates user
  @return: void
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  logOut() {
    this.authServcie.logOut().subscribe(()=>this.router.navigate(['']))
  }
}
