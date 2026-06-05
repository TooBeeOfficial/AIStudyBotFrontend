import { Component } from '@angular/core';
import { FormControl, FormGroup, FormResetEvent, FormSubmittedEvent, PristineChangeEvent, ReactiveFormsModule, StatusChangeEvent, TouchedChangeEvent, Validators, ValueChangeEvent } from '@angular/forms';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.scss',
})
export class LoginPage {
    loginForm = new FormGroup(
        {
            emailControl: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
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
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
            ])
        }
    )

    constructor() {
        this.loginForm.events.subscribe((e) => {
            if (e instanceof ValueChangeEvent) {
                console.log('Value changed to: ', e.value);
            }

            if (e instanceof StatusChangeEvent) {
                console.log('Status changed to: ', e.status);
            }

            if (e instanceof PristineChangeEvent) {
                console.log('Pristine status changed to: ', e.pristine);
            }

            if (e instanceof TouchedChangeEvent) {
                console.log('Touched status changed to: ', e.touched);
            }

            if (e instanceof FormResetEvent) {
                console.log('Form was reset');
            }

            if (e instanceof FormSubmittedEvent) {
                console.log('Form was submitted');
            }
        })
    }

    login() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
    }
    get email() {
        return this.loginForm.controls.emailControl;
    }

    get password() {
        return this.loginForm.controls.passwordControl;
    }

}
