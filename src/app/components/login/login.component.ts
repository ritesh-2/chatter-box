import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoggerService } from 'src/app/services/logger.service';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private hottToast: HotToastService, private router: Router,
    private authServcie: AuthenticationService, private logger: LoggerService) { }

  ngOnInit(): void {
  }

  hide: boolean = false;



  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }


  /**
  @name : LoginComponent.logIn
  @description : Authenticates user
  @return: void
  @author : Ritesh
  @modifiedDate : 03/09/2022
  **/
  logIn() {
    try {
      const { email, password } = this.loginForm.value;
      this.authServcie.logIn(email, password).pipe(
        untilDestroyed(this),
        this.hottToast.observe({
          success: "Login Sucessful..!",
          loading: "loading..",
          error: ({ code }) => `${code ? 'Invalid Password or Email Id' : code}`
        })
      ).subscribe({
        next: (res) => { this.logger.logInfo(this.logger.getLogObject("LoginComponent.logIn", "Login Successfull for user :", res.user.email)); this.router.navigate(['/home']) },
        error: (err) => this.logger.logError(this.logger.getLogObject("LoginComponent.logIn", "Error occured in logging for user :", err)),
        complete: () => this.logger.logInfo(this.logger.getLogObject("LoginComponent.logIn", "Login Subscription completed"))
      })
    } catch (err) {
      this.logger.logError(this.logger.getLogObject("LoginComponent.logIn", "Error occured in logging for user :", err))
    }

  }

}
