import { useState, useEffect } from 'react'

import Split from 'react-split'

import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

import { nanoid } from 'nanoid'

import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { notesCollection, db } from '../firebase'

import './App.css'

function App() {
	const [notes, setNotes] = useState([])
	const [currentNoteId, setCurrentNoteId] = useState('')
	const [tempNoteText, setTempNoteText] = useState('')

	const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

	const sortedNotes = notes.sort((note1, note2) => note2.updatedAt - note1.updatedAt)

	useEffect(() => {
		const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
			const notesArr = snapshot.docs.map(doc => ({
				...doc.data(),
				id: doc.id,
			}))
			setNotes(notesArr)
		})

		return unsubscribe
	}, [])

	useEffect(() => {
		if (!tempNoteText) {
			setTempNoteText(notes[0]?.id)
		}
	}, [notes])

	useEffect(() => {
		if (currentNote) {
			setTempNoteText(currentNote.body)
		}
	}, [currentNote])

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (tempNoteText !== currentNote.body) {
				updateNote(tempNoteText)
			}
		}, 500)
		return () => clearTimeout(timeoutId)
	}, [tempNoteText])

	async function createNewNote() {
		const newNote = {
			body: "# Type your markdown note's title here",
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		const newNoteRef = await addDoc(notesCollection, newNote)
		setCurrentNoteId(newNoteRef.id)
	}

	async function updateNote(text) {
		const docRef = doc(db, 'notes', currentNoteId)
		await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
	}

	async function deleteNote(noteId) {
		const docRef = doc(db, 'notes', noteId)
		await deleteDoc(docRef)
	}

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction="horizontal" className="split">
					<Sidebar
						notes={sortedNotes}
						currentNote={currentNote}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>
					<Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
				</Split>
			) : (
				<div className="no-notes">
					<h1>You have no notes</h1>
					<button className="first-note" onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	)
}

export default App
