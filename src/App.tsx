import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { undo, redo, archiveAllCompletedTodos, resortTodos, addTodoFromTemplate, editTodo, deleteTodo } from './features/todos/todoSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { NewTodoForm } from './components/NewTodoForm';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';
import { TodalToday } from './components/TotalToday';
import { Due } from './shared/due.type';
import { ArchiveFill, ChevronDown, ChevronUp, Filter } from 'react-bootstrap-icons';
import { ProjectName } from './components/ProjectName';
import AppCtx, { useAppContextState } from './context/context';
import { Todo } from './shared/todo.interface';
import { getTodoIdInfoForArrowSelection } from './shared/util';
import { PomodoroTimer } from './components/PomodoroTimer';

function App() {
  const dispatch = useAppDispatch();
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const [showArchive, setShowArchive] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const context = useAppContextState();
  const {
    editingTodoId,
    setEditingTodoId,
    selectedTodoId,
    setSelectedTodoId,
    showNewTodo,
    setShowNewTodo
  } = context;

  const onArchiveAllCompletedTodos = () => {
    dispatch(archiveAllCompletedTodos());
  }

  const onSortTodos = () => dispatch(resortTodos());

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.shiftKey && event.code === 'Slash') {
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }

      if (event.metaKey && event.key === 'Enter') {
        setShowNewTodo(true)
        setSelectedTodoId('');
      }

      if (event.metaKey && event.shiftKey && event.key === '1') {
        dispatch(addTodoFromTemplate('start-day'))
      }

      if (event.metaKey && event.shiftKey && event.key === '2') {
        dispatch(addTodoFromTemplate('start-week'))
      }

      if (event.key === 'Escape') {
        setShowNewTodo(false);
        setEditingTodoId('');
      }

      if (event.metaKey && event.key === 'z') {
        if (event.shiftKey) {
          dispatch(redo());
        } else {
          dispatch(undo());
        }
      }

      if (!showNewTodo && Boolean(selectedTodoId)) {
        if (!Boolean(editingTodoId)) {
          const allTodosOrdered = [...todayTodos, ...laterTodos];
          const todoIdInfo = getTodoIdInfoForArrowSelection(allTodosOrdered, selectedTodoId);
          const todo = allTodosOrdered.find(({ id }) => id === selectedTodoId) as Todo;
          if (event.key === 'm') {
            dispatch(editTodo({ id: todo.id, newTodo: { ...todo, due: todo?.due === Due.Later ? Due.Today : Due.Later }}))
          } else if (event.key === 'a') {
            dispatch(editTodo({ id: todo.id, newTodo: { ...todo, due: Due.Archived, archivedDate: new Date() }}))
          } else if (event.key === 'd') {
            dispatch(deleteTodo({ id: todo.id }))
          } else if (event.key === 'e') {
            setEditingTodoId(todo.id);
            event.preventDefault();
          } else if (event.code === 'ArrowDown') {
            todoIdInfo.nextTodoUUID && setSelectedTodoId(todoIdInfo.nextTodoUUID);
          } else if (event.code === 'ArrowUp') {
            todoIdInfo.previousTodoUUID && setSelectedTodoId(todoIdInfo.previousTodoUUID);
          } else if (event.code === 'Enter') {
            dispatch(editTodo({ id: todo.id, newTodo: { ...todo, done: !todo.done }}))
          } else if (event.key === 'Escape') {
            setSelectedTodoId('');
          }
        }
      }

    }
    window.addEventListener('keydown', listenForKeyboardShortcuts);
    return () => window.removeEventListener('keydown', listenForKeyboardShortcuts);
  })

  const toggleShowArchive = () => setShowArchive(!showArchive);
  return (
    <AppCtx.Provider value={context}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '700px' }}>
            <h1>
              <div style={{ display: 'flex'}}>
                To Do | &nbsp;<ProjectName />
                </div>
              </h1>
          </div>
          <PomodoroTimer />
          <TodalToday />
        </div>
        {showNewTodo && <NewTodoForm />}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex' }}>
            <h3 style={{ marginRight: '10px' }}>Today</h3>
            <div>
              <AddIconButton onClick={() => setShowNewTodo(true)} />
            </div>

          </div>
          <ButtonGroup>
            <Button onClick={onSortTodos} variant="outline-secondary">
              <span style={{ marginRight: '10px' }}><Filter /></span>
              Sort Todos
            </Button>
            <Button variant="outline-primary" onClick={onArchiveAllCompletedTodos}>
              <span style={{ marginRight: '10px' }}><ArchiveFill /></span>
              Archive all completed todos
            </Button>
          </ButtonGroup>
        </div>
        <TodoTable todos={todayTodos} due={Due.Today} />
        <h3>Later</h3>
        <TodoTable todos={laterTodos} due={Due.Later} />
        <div style={{ display: 'flex' }}>
          <div><h3>Archive</h3></div>
          <Button variant="light" onClick={toggleShowArchive} style={{ marginLeft: '10px', marginBottom: '10px' }}>
            {showArchive ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        {showArchive ? <TodoTable todos={archivedTodos} due={Due.Archived} /> : null}
        { showKeyboardShortcuts && <KeyboardShortcuts /> }
      </Container >
    </AppCtx.Provider >
  );
}

export default App;
