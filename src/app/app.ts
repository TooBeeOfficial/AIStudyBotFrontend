import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chatbot } from "./components/chatbot/chatbot";
import { LoginPage } from "./components/login-page/login-page";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
  newtitle = "This is my title!"
  undertitle = "I hate angular structure."
}
