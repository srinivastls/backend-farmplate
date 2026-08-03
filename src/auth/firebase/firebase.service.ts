import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(
  path.join(process.cwd(), 'firebase-service-account.json'),
);

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  verifyToken(idToken: string) {
    return admin.auth().verifyIdToken(idToken);
  }
}