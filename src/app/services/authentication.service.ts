import { Injectable } from '@angular/core';
import { Auth , authState} from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { tap } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser$ = authState(this.auth)

  constructor(private auth: Auth) {
   
   }


  /**
@name: AuthenticationService.logIn()
@description: Authentictes user with firebase authentication
@author: Ritesh
@modifiedOn : 03/09/2022
**/

  public logIn(email: string, passowrd: string) {
    return from(signInWithEmailAndPassword(this.auth, email, passowrd))
  }

  /**
@name: AuthenticationService.sinUp()
@description: Authentictes user with firebase authentication
@author: Ritesh
@modifiedOn : 03/09/2022
**/

  public signUp(email: string, passowrd: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, passowrd))
  }

  /**
@name: AuthenticationService.logOut()
@description: Logout
@author: Ritesh
@modifiedOn : 03/09/2022
**/
  public logOut() {
    return from(this.auth.signOut());
  }

}
