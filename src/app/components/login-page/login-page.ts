import { Component } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule,Validators, } from '@angular/forms';
import { TextForm } from "../text-form/text-form";
import { Button } from "../button/button";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule, TextForm, Button, CommonModule],
    templateUrl: './login-page.html',
    styleUrl: './login-page.css',
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
            ]),
            usernameControl: new FormControl('')
        }
    )
    private signin:boolean = false;

    constructor() {}

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
    
    get username() {
        return this.loginForm.controls.usernameControl;
    }
    get signingIn(){
        return this.signin
    }
    set signingIn(signingIn:boolean){
        this.signin = signingIn
    }
    flipSignIn(){
        console.log("flipped")
        this.signin = !this.signin
    }
    loginWithGoogle(){
        
    }
}
