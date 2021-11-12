import React from 'react';
import './App.css';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppSelector } from './app/hooks';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';
import { TodalToday } from './components/TotalToday';
import { Due } from './shared/due.type';
import { ArchiveFill, ChevronDown, ChevronUp, Filter } from 'react-bootstrap-icons';
import { ProjectName } from './components/ProjectName';
import { useReduxActionsWithContext, useAppContext } from './context/context';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EventToastContainer } from './components/EventToastContainer';
import { useGlobalKeyboardShortcuts } from './shared/useGlobalKeyboardShortcuts';

function App() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const {
    showArchive,
    setShowArchive,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
  } = useAppContext();
  const { sortTodosWithToast, onArchiveAllCompletedTodosWithToast, addNewTodoAndStartEditing, addTodoFromTemplateWithToast } = useReduxActionsWithContext();
  
  useGlobalKeyboardShortcuts()

  const toggleShowArchive = () => setShowArchive(!showArchive);
  return (
    <div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex' }}>
            <h3 style={{ marginRight: '10px' }}>Today</h3>
            <div>
              <ButtonGroup>
              <AddIconButton onClick={addNewTodoAndStartEditing} />
            <Button
              variant="outline-primary"
              onClick={() => addTodoFromTemplateWithToast("start-day")}
            >
              Start Day
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => addTodoFromTemplateWithToast("start-week")}
            >
              Start Week
            </Button>
          </ButtonGroup>
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
    </div>
  );
}

export default App;

