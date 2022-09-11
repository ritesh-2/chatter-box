import { Injectable } from '@angular/core';
import { LogModel } from '../models/log-model';
import { doc, setDoc } from '@firebase/firestore';
import { collection, collectionData, docData, Firestore, query, updateDoc } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user-profile';
import { from, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private fireStore: Firestore,
    private authService: AuthenticationService) {
  }

  /**
@name: UserService.allusers$
@description: Return all users from firestore
@author: Ritesh
@modifiedOn : 03/09/2022
**/
  get allusers$(): Observable<ProfileUser[]> {
    const ref = collection(this.fireStore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<ProfileUser[]>
  }


  /**
@name: UserService.currentUserProfile$
@description: Return currently logged in user from users collection 
@author: Ritesh
@modifiedOn : 03/09/2022
**/
  currentUser$ = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (!user || !user.email) return of(null);
      else {
        const ref = doc(this.fireStore, 'users', user.email)
        return docData(ref) as Observable<ProfileUser>
      }
    })
  )

  /**
@name: UserService.fetchProfileById()
@description: Return currently logged in user from users collection 
@author: Ritesh
@modifiedOn : 03/09/2022
**/
  // fetchProfileById(eamilId) {
  //   this.authService.currentUser$.pipe(
  //     switchMap((user) => {
  //       if (!user || !user.email) return of(null);
  //       else {
  //         const ref = doc(this.fireStore, 'users', user.email)
  //         return docData(ref) as Observable<ProfileUser>
  //       }
  //     })
  //   )
  // } 

  /**
@name: UserService.addUser()
@description: 
@author: Ritesh
@modifiedOn : 03/09/2022
**/
  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.fireStore, 'users', user.email)
    return from(setDoc(ref, user))
  }

  /**
@name: UserService.updateUser()
@description: 
@author: Ritesh
@modifiedOn : 03/09/2022
**/

  updateUser(user: ProfileUser) {
    const ref = doc(this.fireStore, 'users', user.email)
    return from(updateDoc(ref, { ...user }))
  }

  updatenewtorkStatus(status) {
    this.currentUser$.subscribe({
      next: (user) => {
        user.isOnline = status
        this.updateUser(user);
      },
      error: (err) => console.log("Error ocurred while updating online status", err)
    })
  }

}
