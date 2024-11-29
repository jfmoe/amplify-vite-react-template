import React, { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();
const App: React.FC = () => {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const [logs, setLogs] = useState<Array<Schema['Logs']['type']>>([]);

  const fetchData = () => {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: data => setTodos([...data.items]),
      });

      client.models.Logs.observeQuery().subscribe({
        next: data => setLogs([...data.items]),
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt('Todo content'),
      devId: '123',
      _ttl: Date.now() / 1000 + 60,
    });
  }

  function updateToDo(id: string) {
    client.models.Todo.update({ id, content: window.prompt('Todo content') });
  }

  function deleteLog(id: string) {
    client.models.Logs.delete({ id });
  }

  function createLogs() {
    client.models.Logs.create({ content: window.prompt('Logs content') });
  }

  return (
    <main>
      <h1>User Auth My Logs</h1>
      <button onClick={createLogs}>+ new log</button>
      <ul>
        {logs.map(log => (
          <li key={log.id} onClick={() => deleteLog(log.id)}>
            {log.content}
          </li>
        ))}
      </ul>
      <h1>Public Auth My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => updateToDo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default React.memo(App);
