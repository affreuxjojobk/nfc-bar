import { firebase } from './firebaseConfig';

export const mettreAJourPointsClient = async (userId, points) => {
  const db = firebase.firestore();
  const userRef = db.collection('users').doc(userId);
  await userRef.update({
    points_fidelite: firebase.firestore.FieldValue.increment(points)
  });
};
