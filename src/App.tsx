import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, ButtonGroup, Container, Toast, ToastContainer } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { undo, redo, archiveAllCompletedTodos, resortTodos, addTodoFromTemplate, editTodo, deleteTodo } from './features/todos/todoSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { NewTodoForm } from './components/NewTodoForm';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';
import { TodalToday } from './components/TotalToday';
import { Due } from './shared/due.type';
import { ArchiveFill, ChevronDown, ChevronUp, Filter } from 'react-bootstrap-icons';
import { ProjectName } from './components/ProjectName';
import AppCtx, { useAppContextState, composeReduxActionsWithContextToast } from './context/context';
import { Todo } from './shared/todo.interface';
import { getTodoIdInfoForArrowSelection } from './shared/util';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EventToastContainer } from './components/EventToastContainer';

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
    setShowNewTodo,
    addToast
  } = context;
  const { undoWithToast, redoWithToast, addTodoFromTemplateWithToast, sortTodosWithToast, onArchiveAllCompletedTodosWithToast, deleteTodoWithToast, archiveTodoWithToast, moveTodoWithToast } = composeReduxActionsWithContextToast(dispatch, addToast)

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
        addTodoFromTemplateWithToast('start-day')
      }

      if (event.metaKey && event.shiftKey && event.key === '2') {
        addTodoFromTemplateWithToast('start-week')
      }

      if (event.key === 'Escape') {
        setShowNewTodo(false);
        setEditingTodoId('');
      }

      if (event.metaKey && event.key === 'z') {
        if (event.shiftKey) {
          redoWithToast()
        } else {
          undoWithToast()
        }
      }

      if (!showNewTodo && !Boolean(editingTodoId)) {
        if (event.key === 's') {
          sortTodosWithToast();
        }
        if (event.key === 'v') {
          onArchiveAllCompletedTodosWithToast();
        }
        const allTodosOrdered = [...todayTodos, ...laterTodos];
        if (Boolean(selectedTodoId)) {
          const todoIdInfo = getTodoIdInfoForArrowSelection(allTodosOrdered, selectedTodoId);
          const todo = allTodosOrdered.find(({ id }) => id === selectedTodoId) as Todo;
          if (event.key === 'm') {
            moveTodoWithToast(todo, todo?.due === Due.Later ? Due.Today : Due.Later);
          } else if (event.key === 'a') {
            archiveTodoWithToast(todo);
          } else if (event.key === 'd') {
            deleteTodoWithToast(todo);
          } else if (event.key === 'e') {
            setEditingTodoId(todo.id);
            event.preventDefault();
          } else if (event.code === 'ArrowDown') {
            event.preventDefault();
            todoIdInfo.nextTodoUUID && setSelectedTodoId(todoIdInfo.nextTodoUUID);
          } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            todoIdInfo.previousTodoUUID && setSelectedTodoId(todoIdInfo.previousTodoUUID);
          } else if (event.code === 'Space') {
            dispatch(editTodo({ id: todo.id, newTodo: { ...todo, done: !todo.done }}))
            event.preventDefault();
          } else if (event.key === 'Escape') {
            setSelectedTodoId('');
          } else if (event.key === 'Enter') {
            if (todo.links[0]?.url) {
              window.open(todo.links[0].url, '_blank', 'noopener,noreferrer')
            }
          }
        } else if (event.code === 'ArrowDown') {
          const firstItem = allTodosOrdered[0];
          setSelectedTodoId(firstItem?.id);
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
      <EventToastContainer />
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
            <Button onClick={sortTodosWithToast} variant="outline-secondary">
              <span style={{ marginRight: '10px' }}><Filter /></span>
              Sort Todos
            </Button>
            <Button variant="outline-primary" onClick={onArchiveAllCompletedTodosWithToast}>
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
        <KeyboardShortcutsModal show={showKeyboardShortcuts} handleClose={() => setShowKeyboardShortcuts(false)}/>
      </Container >
    </AppCtx.Provider >
  );
}

export default App;

