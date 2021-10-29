import React, { useState, useEffect } from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { undo, redo } from './features/todos/todoSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { NewTodoForm } from './components/NewTodoForm';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';

function App() {
  const dispatch = useAppDispatch();
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const [showNewTodo, setShowNewTodo] = useState(false);

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
  return (
    <div className="App">
      <Container>
        <h1>🎵 To Do Ron Ron 🎵</h1>
        <hr />
        <h3>New Todo <AddIconButton onClick={() => setShowNewTodo(true)} /></h3>
        {showNewTodo && <NewTodoForm />}
        <hr />

        <h3>Today</h3>
        <TodoTable todos={todayTodos} due="today" />
        <hr />
        <h3>Later</h3>
        <TodoTable todos={laterTodos} due="later" />
        <hr />
        <hr />
        <KeyboardShortcuts />
      </Container>
    </div >
  );
}

export default App;
