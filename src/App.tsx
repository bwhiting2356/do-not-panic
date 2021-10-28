import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { TodoTable } from './components/TodoTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { selectTodosDueLater, selectTodosDueToday } from './features/todos/todoSlice';
import { useAppSelector } from './app/hooks';
import { NewTodoForm } from './components/NewTodoForm';

function App() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  return (
    <div className="App">
      <Container>
        <h1>Do Not Panic</h1>
        <hr />
        <h3>Today</h3>
        <TodoTable todos={todayTodos} due="today" />
        <hr />
        <h3>New Todo</h3>
        <NewTodoForm />
        <h3>Later</h3>
        <TodoTable todos={laterTodos} due="later" />
      </Container>
    </div>
  );
}

export default App;
