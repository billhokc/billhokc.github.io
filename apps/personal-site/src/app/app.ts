import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthMenu } from './auth-menu/auth-menu';

@Component({
  imports: [MatButtonModule, MatToolbarModule, RouterLink, RouterOutlet, AuthMenu],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Billy H.';
}
