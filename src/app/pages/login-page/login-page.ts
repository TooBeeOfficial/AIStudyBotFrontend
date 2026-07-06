import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextForm } from '../../shared/Components/text-form/text-form';
import { Button } from '../../shared/Components/button/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user';
import { UserModel } from '../../models/UserModel';
import { RouteServices } from '../../shared/route-services';
import { switchMap, take, tap } from 'rxjs';
import { AIModel } from '../../models/aiModel';
import { MessageModel } from '../../models/chatMessageModel';
import { ChatModel } from '../../models/chatModel';
import { ChatOperationServices } from '../../shared/chat-operation-services';
import { AIBotService } from '../../shared/services/aibot';
import { ChatService } from '../../shared/services/chat';
import { QuizService } from '../../shared/services/quiz';
import { ActivatedRoute } from '@angular/router';

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
    passwordSignUpControl: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]),
    usernameControl: new FormControl(''),
  });

  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  navigationService: RouteServices = inject(RouteServices);
  routeService: RouteServices = inject(RouteServices);
  AIBotService: AIBotService = inject(AIBotService);
  userService: UserService = inject(UserService);

  private signin: boolean = false;

  login() {
    if (this.email.invalid || this.password.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      this.userService
        .loginUser(this.email.getRawValue() ?? '', this.password.getRawValue() ?? '')
        .pipe(
          tap((user) => this.userService.setUser(UserModel.fromApi(user))),
          switchMap(() => this.chatOperationService.chatService.loadChats()),
          switchMap(() => this.chatOperationService.chatService.getAllFirstMessages()),
          switchMap((values) =>
            this.chatOperationService.chatService.allchats$.pipe(
              tap((chats) => {
                if (!chats) return;
                chats.forEach((chat) => {
                  for (let index = 0; index < chats.length; index++) {
                    if (chat.id === values[index].chat_id) {
                      chat.firstMessage = values[index];
                    }
                  }
                });
                this.routeService.navigateTo(RouteServices.routes.home);
              }),
            ),
          ),
          switchMap(() => this.AIBotService.getAIModels()),
          tap((models) => {
            let modes: AIModel[] = [];
            models.forEach((model) => {
              modes.push(AIModel.fromApi(model));
            });

            this.AIBotService.setAIModels(modes);
          }),
        )
        .subscribe();
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
          next: () => {},
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
