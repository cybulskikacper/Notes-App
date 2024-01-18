import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCOeNZ2UnR8F88P99uaJM45inX_xQR-Ylo',
	authDomain: 'react-notes-2b698.firebaseapp.com',
	projectId: 'react-notes-2b698',
	storageBucket: 'react-notes-2b698.appspot.com',
	messagingSenderId: '303305903052',
	appId: '1:303305903052:web:0a600245b357abe4caeb69',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const notesCollecction = collection(db, )
