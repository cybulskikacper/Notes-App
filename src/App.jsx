import { useState, useEffect } from 'react'

import Split from 'react-split'

import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

import { nanoid } from 'nanoid'

import { onSnapshot } from 'firebase/firestore'
import { notesCollection } from '../firebase'

import './App.css'

function App() {
	// lazily initialization our notes, it dosent reach into localstorage on every single re-render of the app commponent
	const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || [])
	const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '')

	const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

	useEffect(() => {
		// call back fucntion
		const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
			//  Sync up our local notes array with the snapshot data
		})

		return unsubscribe
	}, [])

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "# Type your markdown note's title here",
		}
		setNotes(prevNotes => [newNote, ...prevNotes])
		setCurrentNoteId(newNote.id)
	}

	function updateNote(text) {
		setNotes(oldNotes => {
			const newArray = []
			for (let i = 0; i < oldNotes.length; i++) {
				const oldNote = oldNotes[i]
				if (oldNote.id === currentNoteId) {
					newArray.unshift({ ...oldNote, body: text })
				} else {
					newArray.push(oldNote)
				}
			}
			return newArray
		})
	}

	// This does not rearrange the notes
	// setNotes(oldNotes => oldNotes.map(oldNote => {
	//     return oldNote.id === currentNoteId
	//         ? { ...oldNote, body: text }
	//         : oldNote
	// }))

	function deleteNote(event, noteId) {
		event.stopPropagation()
		const updatedNotes = notes.filter(note => note.id !== noteId)
		setNotes(updatedNotes)

		if (currentNoteId === noteId && updatedNotes.length > 0) {
			setCurrentNoteId(updatedNotes[0].id)
		}
	}

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction="horizontal" className="split">
					<Sidebar
						notes={notes}
						currentNote={currentNote}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>
					{currentNoteId && notes.length > 0 && <Editor currentNote={currentNote} updateNote={updateNote} />}
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
