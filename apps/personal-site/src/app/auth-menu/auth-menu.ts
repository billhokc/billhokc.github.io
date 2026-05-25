import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GoogleAuthService } from '@billhokc/auth';

@Component({
    selector: 'app-auth-menu',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './auth-menu.html',
    styleUrl: './auth-menu.scss',
})
export class AuthMenu {
    private authService = inject(GoogleAuthService);
    protected readonly user = toSignal(this.authService.user$);

    protected login(): void {
        this.authService.loginWithGoogle().subscribe();
    }

    protected logout(): void {
        this.authService.logout().subscribe();
    }
}
