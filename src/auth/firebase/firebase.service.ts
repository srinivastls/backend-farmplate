import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

// const serviceAccount = require(
//   path.join(process.cwd(), 'firebase-service-account.json'),
// );
@Injectable()
export class FirebaseService {
  constructor() {
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   });
    // }
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }


  verifyToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }

  async deleteUser(uid: string) {
    try {
      await admin.auth().deleteUser(uid);
      return true;
    } catch (error: any) {
      // Firebase user may already be deleted.
      if (error?.code === 'auth/user-not-found') {
        return true;
      }

      throw error;
    }
  }

}