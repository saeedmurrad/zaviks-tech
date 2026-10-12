import { environment } from '../../environments/environment';

export function firebaseConfigured(): boolean {
  return environment.firebase.apiKey.length > 0 && environment.firebase.projectId.length > 0;
}

/** Lazily initialises the single Firebase app so the SDK stays out of the initial bundle. */
export async function firebaseApp() {
  const { getApps, initializeApp } = await import('firebase/app');
  return getApps()[0] ?? initializeApp(environment.firebase);
}

export async function firestore() {
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(await firebaseApp());
}

export function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const maybe = value as { toDate?: () => Date };
  return typeof maybe.toDate === 'function' ? maybe.toDate() : undefined;
}

/** Turns Firebase error codes into sentences a customer can act on. */
export function friendlyError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with that email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return 'That email address does not look right.';
    case 'auth/weak-password':
      return 'Choose a password of at least 8 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password is not right.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'We could not reach the server. Check your connection and try again.';
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return 'Sign-in is not switched on for this site yet. Please email us instead.';
    case 'permission-denied':
      return 'You do not have permission to do that.';
    default:
      return fallback;
  }
}
