import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  isLoggedIn = signal(!!localStorage.getItem('user'));

  get userId() {
    if (localStorage.getItem('user')) {
      return localStorage.getItem('user')?.valueOf();
    }
    return this._auth.currentUser?.uid;
  }

  byGoogle(): Promise<UserCredential> {
    return signInWithPopup(this._auth, new GoogleAuthProvider());
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    );
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    );
  }

  logUserOut() {
    return signOut(this._auth)
      .then(() => {
        this.isLoggedIn.set(false);
        localStorage.removeItem('user');
      })
      .catch(error => console.error(error));
  }

  constructor() {
    onAuthStateChanged(this._auth, user => {
      if (user?.uid) {
        localStorage.setItem('user', user.uid);
        this.isLoggedIn.set(!!(user.uid && user.uid.length > 1));
      }
    });
  }
}
