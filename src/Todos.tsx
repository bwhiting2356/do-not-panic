import React, { useRef, useEffect } from 'react';
import './App.css';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppSelector } from './app/hooks';
import { AddIconButton } from './components/icon-buttons/AddIconButton';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from './features/todos/selectors';
import { TodalToday } from './components/TotalToday';
import { Due } from './shared/due.type';
import { ArchiveFill, BrightnessAltHigh, BrightnessHigh, ChevronDown, ChevronUp, Filter } from 'react-bootstrap-icons';
import { ProjectName } from './components/ProjectName';
import { useReduxActionsWithContext, useAppContext } from './context/context';
import { PomodoroTimer } from './components/PomodoroTimer';
import { EventToastContainer } from './components/EventToastContainer';
import { useGlobalKeyboardShortcuts } from './components/custom-hooks/useGlobalKeyboardShortcuts';
import { Todo, TodoTemplates } from './shared/todo';
import { IconButton } from './components/icon-buttons/IconButton';
import { ProjectAnalyticsModal } from './components/modals/project-analytics/ProjectAnalyticsModal';
import { EditProjectsModal } from './components/modals/EditProjectsModal';
import { ConfettiAnimation } from './components/animation/ConfettiAnimation';

function Todos() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const {
    showArchive,
    setShowArchive,
    showAnimation,
    setShowAnimation
  } = useAppContext();
  const { sortTodosWithToast, onArchiveAllCompletedTodosWithToast, addNewTodoAndStartEditing, addTodoFromTemplateWithToast } = useReduxActionsWithContext();
  
  
  useGlobalKeyboardShortcuts();

  const prevTodosRef = useRef<Todo[]>(todayTodos);
  useEffect(() => {
    console.log('in effect');
    const doneTodos = todayTodos.reduce((acc, curr) => {
      if (curr.done) return acc + 1;
      return acc;
    }, 0)

    const prevDoneTodos = prevTodosRef.current.reduce((acc, curr) => {
      if (curr.done) return acc + 1;
      return acc;
    }, 0)

    if (doneTodos > prevDoneTodos) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false)
      }, 1500);
    }
    prevTodosRef.current = todayTodos;
  }, [todayTodos, setShowAnimation])

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
            <ButtonGroup>
                <AddIconButton onClick={addNewTodoAndStartEditing} />
                <IconButton text="Start Day" Icon={BrightnessAltHigh} variant="outline-primary" onClick={() => addTodoFromTemplateWithToast(TodoTemplates.StartDay)} />
                <IconButton text="Start Week" Icon={BrightnessHigh} variant="outline-secondary" onClick={() => addTodoFromTemplateWithToast(TodoTemplates.StartWeek)} />
              </ButtonGroup>
          </div>
          <ButtonGroup>
            <IconButton text="Sort Todos" Icon={Filter} variant="outline-secondary" onClick={sortTodosWithToast} />
            <IconButton text="Archive all completed todos" Icon={ArchiveFill} variant="outline-primary" onClick={onArchiveAllCompletedTodosWithToast} />
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
        <KeyboardShortcutsModal />
        <ProjectAnalyticsModal />
        <EditProjectsModal />
        <ConfettiAnimation play={showAnimation} />
      </Container >
    </div>
  );
}

export default Todos;

