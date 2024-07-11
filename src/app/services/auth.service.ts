import { Injectable } from '@angular/core';
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
import { UserState } from '../store/user/reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
        if (!sessionStorage.getItem('user')) {
          const userObj: UserState = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            baseCurrency: 'ZAR',
          };
          sessionStorage.setItem('user', JSON.stringify(userObj));
        }
      } else {
        sessionStorage.removeItem('user');
      }
    });
  }
}
