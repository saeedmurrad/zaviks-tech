import { isPlatformBrowser } from '@angular/common';
import { computed, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { firebaseApp, firebaseConfigured, firestore, toDate } from './firebase';

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
}

export interface Profile {
  uid: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  createdAt?: Date;
}

/**
 * Customer accounts on Firebase Auth (email and password). The user signal is `undefined`
 * while the session is being restored, `null` when signed out, and a user otherwise.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly user = signal<AuthUser | null | undefined>(undefined);
  readonly profile = signal<Profile | null>(null);
  readonly isAdmin = computed(() => {
    const user = this.user();
    return !!user && environment.admins.includes(user.email.toLowerCase());
  });
  readonly ready: Promise<void>;
  private resolveReady!: () => void;

  constructor() {
    this.ready = new Promise((resolve) => (this.resolveReady = resolve));
    if (!this.isBrowser || !firebaseConfigured()) {
      this.user.set(null);
      this.resolveReady();
      return;
    }
    void this.listen();
  }

  readonly enabled = this.isBrowser && firebaseConfigured();

  private async auth() {
    const { getAuth } = await import('firebase/auth');
    return getAuth(await firebaseApp());
  }

  private async listen(): Promise<void> {
    const { onAuthStateChanged } = await import('firebase/auth');
    const auth = await this.auth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.user.set(null);
        this.profile.set(null);
        this.resolveReady();
        return;
      }
      this.user.set({
        uid: user.uid,
        email: user.email ?? '',
        emailVerified: user.emailVerified,
        displayName: user.displayName ?? '',
      });
      await this.loadProfile(user.uid);
      this.resolveReady();
    });
  }

  private async loadProfile(uid: string): Promise<void> {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(await firestore(), 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        this.profile.set({
          uid,
          name: data['name'] ?? '',
          email: data['email'] ?? '',
          company: data['company'] ?? '',
          phone: data['phone'] ?? '',
          createdAt: toDate(data['createdAt']),
        });
      }
    } catch {
      this.profile.set(null);
    }
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
    company: string;
  }): Promise<void> {
    const { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } =
      await import('firebase/auth');
    const { doc, serverTimestamp, setDoc } = await import('firebase/firestore');
    const auth = await this.auth();
    const credential = await createUserWithEmailAndPassword(
      auth,
      input.email.trim(),
      input.password,
    );
    await updateProfile(credential.user, { displayName: input.name.trim() });
    await setDoc(doc(await firestore(), 'users', credential.user.uid), {
      name: input.name.trim(),
      email: input.email.trim(),
      company: input.company.trim(),
      phone: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    sendEmailVerification(credential.user).catch(() => undefined);
    this.user.set({
      uid: credential.user.uid,
      email: credential.user.email ?? '',
      emailVerified: false,
      displayName: input.name.trim(),
    });
    await this.loadProfile(credential.user.uid);
  }

  async login(email: string, password: string): Promise<void> {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(await this.auth(), email.trim(), password);
  }

  async logout(): Promise<void> {
    const { signOut } = await import('firebase/auth');
    await signOut(await this.auth());
  }

  async resetPassword(email: string): Promise<void> {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(await this.auth(), email.trim());
  }

  async resendVerification(): Promise<void> {
    const { sendEmailVerification } = await import('firebase/auth');
    const auth = await this.auth();
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  /** Re-reads the signed-in user so a fresh email verification is picked up without signing out. */
  async refresh(): Promise<void> {
    const auth = await this.auth();
    const current = auth.currentUser;
    if (!current) return;
    await current.reload();
    await current.getIdToken(true);
    this.user.set({
      uid: current.uid,
      email: current.email ?? '',
      emailVerified: current.emailVerified,
      displayName: current.displayName ?? '',
    });
  }

  async saveProfile(patch: { name: string; company: string; phone: string }): Promise<void> {
    const user = this.user();
    if (!user) return;
    const { updateProfile } = await import('firebase/auth');
    const { doc, serverTimestamp, setDoc } = await import('firebase/firestore');
    const auth = await this.auth();
    await setDoc(
      doc(await firestore(), 'users', user.uid),
      {
        name: patch.name.trim(),
        email: user.email,
        company: patch.company.trim(),
        phone: patch.phone.trim(),
        createdAt: this.profile()?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    if (auth.currentUser && auth.currentUser.displayName !== patch.name.trim()) {
      await updateProfile(auth.currentUser, { displayName: patch.name.trim() });
    }
    await this.loadProfile(user.uid);
  }
}
