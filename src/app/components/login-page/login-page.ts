import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextForm } from '../text-form/text-form';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TextForm, Button, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  loginForm = new FormGroup({
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    /* 
                At least 8 characters
                At most 16 characters
                At least one lowercase letter
                At least one uppercase letter
                At least one number
            */
    passwordControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]),
    usernameControl: new FormControl(''),
    passwordSignUpControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]),
  });
  private signin: boolean = false;
  private userService = inject(UserService);

  constructor() {}

  login() {
    if (this.email.invalid || this.password.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      this.userService
        .loginUser(this.email.getRawValue() ?? '', this.password.getRawValue() ?? '')
        .subscribe({
          next: (rseponse) => {
            console.log(rseponse);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    }
  }

  signUp() {
    if (
      this.email.invalid ||
      this.password.invalid ||
      this.ConfirmPassword.invalid ||
      this.username.invalid
    ) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      if (
        this.password.getRawValue() != this.ConfirmPassword.getRawValue() &&
        this.password.getRawValue() != ''
      ) {
        this.loginForm.markAllAsTouched();
        return;
      }
      this.userService
        .signUpUser(
          this.username.getRawValue() ?? '',
          this.email.getRawValue() ?? '',
          this.password.getRawValue() ?? '',
        )
        .subscribe({
          next: (rseponse) => {
            console.log('RESPONSE', rseponse);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    }
  }

  googleLogin() {
    this.userService.googleLoginSignUp();
  }
  get email() {
    return this.loginForm.controls.emailControl;
  }
  get password() {
    return this.loginForm.controls.passwordControl;
  }
  get ConfirmPassword() {
    return this.loginForm.controls.passwordSignUpControl;
  }
  get username() {
    return this.loginForm.controls.usernameControl;
  }
  get signingIn() {
    return this.signin;
  }
  set signingIn(signingIn: boolean) {
    this.signin = signingIn;
  }
  flipSignIn() {
    this.signin = !this.signin;
  }
}
/*

getUser().subscribe(
        (res)=>{
            console.log(res)
        }
    ) 
logout().subscribe((res)=>{
        console.log(res)
    })
*/
