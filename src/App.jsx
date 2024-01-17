import { useState, useEffect } from 'react'

import Split from 'react-split'

import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

import { data } from '../Data'
import { nanoid } from 'nanoid'

import './App.css'

function App() {
	// lazily initialization our notes, it dosent reach into localstorage on every single re-render of the app commponent
	const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || [])
	const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || '')

	useEffect(() => {
		localStorage.setItem('notes', JSON.stringify(notes))
	}, [notes])

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

	function findCurrentNote() {
		return (
			notes.find(note => {
				return note.id === currentNoteId
			}) || notes[0]
		)
	}

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction="horizontal" className="split">
					<Sidebar
						notes={notes}
						currentNote={findCurrentNote()}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>
					{currentNoteId && notes.length > 0 && <Editor currentNote={findCurrentNote()} updateNote={updateNote} />}
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
