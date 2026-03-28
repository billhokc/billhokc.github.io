import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';

type ProjectLink = {
  name: string;
  description: string;
  url: string;
};

@Component({
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatToolbarModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Bill Ho KC';
  protected readonly blurb =
    'Engineer and builder focused on practical products, clean architecture, and developer-friendly experiences.';
  protected readonly projectLinks: ProjectLink[] = [
    {
      name: 'My Existing Project',
      description:
        'This is a placeholder for the project you plan to import into this Nx monorepo.',
      url: 'https://github.com/YOUR_USERNAME/YOUR_REPO',
    },
  ];
}
