import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserCredential } from '@angular/fire/auth';
import { switchMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoggerService } from 'src/app/services/logger.service';
import { UserService } from 'src/app/services/user.service';
import { tap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


//  cross field validator
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passowrd = control.get('password')?.value;
    const confirmPassowrd = control.get('confirmPassword')?.value;

    if (passowrd && confirmPassowrd && passowrd !== confirmPassowrd) {
      return {
        passwordsDontMatch: true
      }
    }
    return null
  }
}

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthenticationService, private hotToast: HotToastService
    , private logger: LoggerService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }


  public hide: boolean = false;

  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
    { validators: passwordMatchValidator() }
  )

  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  /**
@name: SignupComponent.signUp()
@description: Authentictes user with firebase authentication
@author: Ritesh
@modifiedOn : 03/09/2022
**/

  signUp() {
    try {
      const { name, email, password } = this.signUpForm.value;

      this.authService.signUp(email, password).pipe(
        untilDestroyed(this),
        switchMap((userCred: UserCredential) => {
          let user = new ProfileUser();
          user.email = email;
          user.displayName = name;

          this.logger.logInfo(this.logger.getLogObject("SignupComponent.signUp()", "User credential returned adding user to firestore db", userCred.user.email));

          return this.userService.addUser({ ...user })
        }),
        this.hotToast.observe({
          success: "Signed in Successfully",
          loading: "Loading...!",
          error: ({ msg }) => `Error Occured ${msg}`
        })

      ).subscribe({
        next: (res) => { this.logger.logInfo(this.logger.getLogObject("SignupComponent.signUp()", "signUp Successfull for user :", res.user.email)); this.router.navigate['/home'] },
        error: (err) => this.logger.logError(this.logger.getLogObject("SignupComponent.signUp()", "Error occured in Sign Up for user :", err)),
        complete: () => this.logger.logInfo(this.logger.getLogObject("SignupComponent.signUp()", "SignUpSubscription completed"))
      })
    } catch (err) {
      this.logger.logError(this.logger.getLogObject("SignupComponent.signUp()", "Error occured in Sign Up for user :", err))
    }
  }

}
