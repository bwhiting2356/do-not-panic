import React, { useRef, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { TodoTable } from './TodoTable';
import { useAppSelector } from '../../app/hooks';
import { AddIconButton } from '../icon-buttons/AddIconButton';
import { KeyboardShortcutsModal } from '../modals/KeyboardShortcutsModal';
import { selectArchivedTodos, selectTodosDueLater, selectTodosDueToday } from '../../features/todos/selectors';
import { Due } from '../../shared/due.type';
import { ArchiveFill, BrightnessAltHigh, BrightnessHigh, ChevronDown, ChevronUp, Filter } from 'react-bootstrap-icons';
import { useReduxActionsWithContext, useAppContext } from '../../context/context';
import { EventToastContainer } from '../EventToastContainer';
import { useTodosKeyboardShortcuts } from './useTodosKeyboardShortcuts';
import { Todo, TodoTemplates } from '../../shared/todo';
import { IconButton } from '../icon-buttons/IconButton';
import { ProjectAnalyticsModal } from '../modals/project-analytics/ProjectAnalyticsModal';
import { ConfettiAnimation } from '../animation/ConfettiAnimation';
import { ArchiveToggleButton } from '../ArchiveToggleButton';

function Todos() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const {
    showArchive,
    setShowAnimation
  } = useAppContext();
  const { sortTodosWithToast, onArchiveAllCompletedTodosWithToast, addNewTodoAndStartEditing, addTodoFromTemplateWithToast } = useReduxActionsWithContext();
  
  useTodosKeyboardShortcuts();

  const prevTodosRef = useRef<Todo[]>(todayTodos);
  useEffect(() => {
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
    }
    prevTodosRef.current = todayTodos;
  }, [todayTodos, setShowAnimation])

  return (
    <div>
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
        <ArchiveToggleButton />
        {showArchive ? <TodoTable todos={archivedTodos} due={Due.Archived} /> : null}
    </div>
  );
}

export default Todos;

