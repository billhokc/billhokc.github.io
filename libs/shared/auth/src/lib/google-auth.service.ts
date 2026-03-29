import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import type { User, UserCredential } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
    private auth = inject(Auth);
    user$ = user(this.auth);

    loginWithGoogle(): Observable<UserCredential> {
        const provider = new GoogleAuthProvider();
        return from(signInWithPopup(this.auth, provider));
    }

    logout(): Observable<void> {
        return from(signOut(this.auth));
    }

    getCurrentUser(): Observable<User | null> {
        return this.user$;
    }
}
