import { Injectable, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal(!!sessionStorage.getItem('user'));

  get userId() {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')?.valueOf() ?? '').uid;
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
    return signOut(this._auth);
  }

  constructor(private _auth: Auth) {
    onAuthStateChanged(this._auth, user => {
      if (user?.uid) {
        this.isLoggedIn.set(!!(user.uid && user.uid.length > 1));
      } else {
        sessionStorage.removeItem('user');
        this.isLoggedIn.set(false);
      }
    });
  }
}
