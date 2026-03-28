import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

type ProjectLink = {
	name: string;
	description: string;
	url: string;
	ctaLabel: string;
	openInNewTab?: boolean;
	routerLink?: string;
};

@Component({
	imports: [MatButtonModule, MatCardModule, MatDividerModule, RouterLink],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class HomePage {
	protected readonly title = 'Billy H.';
	protected readonly blurb =
		'Senior developer making a home in a little corner of the web.  This is a personal site to share projects and other pieces of my life.';
	protected readonly projectLinks: ProjectLink[] = [
		{
			name: 'Reward Benefits Tracker',
			description:
				'Track yearly and monthly credit-card benefits redeemed, with data stored in Firestore.',
			url: '',
			routerLink: '/reward-benefits-tracker',
			ctaLabel: 'Open App',
		},
		{
			name: 'Source Code',
			description: 'Browse this monorepo and project history on GitHub.',
			url: 'https://github.com/billhokc/billhokc',
			ctaLabel: 'Open Repo',
			openInNewTab: true,
		},
	];
}
