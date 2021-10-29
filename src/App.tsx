import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { undo, redo, archiveAllCompletedTodos } from './features/todos/todoSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { NewTodoForm } from './components/NewTodoForm';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';
import { TodalToday } from './components/TotalToday';
import { Due } from './shared/due.type';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

function App() {
  const dispatch = useAppDispatch();
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const onArchiveAllCompletedTodos = () => {
    dispatch(archiveAllCompletedTodos());
  }

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'Enter') {
        setShowNewTodo(true)
      }

      if (event.key === 'Escape') {
        setShowNewTodo(false);
      }

      if (event.metaKey && event.key === 'z') {
        if (showNewTodo) {
          alert('undo/redo disabled while form is open (future UX TBD...)');
          return;
        }


        if (event.shiftKey) {
          dispatch(redo());
        } else {
          dispatch(undo());
        }
      }

    }
    window.addEventListener('keydown', listenForKeyboardShortcuts);
    return () => window.removeEventListener('keydown', listenForKeyboardShortcuts);
  })

  const toggleShowArchive = () => setShowArchive(!showArchive);
  return (
    <div className="App">
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div><h1>🎵 To Do Ron Ron 🎵</h1></div>
          <TodalToday />
        </div>

        <hr />
        <h3>New Todo <AddIconButton onClick={() => setShowNewTodo(true)} /></h3>
        {showNewTodo && <NewTodoForm />}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div><h3>Today</h3></div>
          <Button onClick={onArchiveAllCompletedTodos}>Archive all completed todos</Button>
        </div>


        <TodoTable todos={todayTodos} due={Due.Today} />
        <hr />
        <h3>Later</h3>
        <TodoTable todos={laterTodos} due={Due.Later} />
        <hr />
        <div style={{ display: 'flex' }}>
          <div><h3>Archive</h3></div>
          <Button variant="light" onClick={toggleShowArchive} style={{ marginLeft: '10px', marginBottom: '10px' }}>
            {showArchive ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        {showArchive ? <TodoTable todos={archivedTodos} due={Due.Archived} /> : null}

        <hr />
        <hr />
        <KeyboardShortcuts />
      </Container>
    </div >
  );
}

export default App;
