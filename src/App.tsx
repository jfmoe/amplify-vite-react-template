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

  async function createTodo() {
    console.log(Math.floor(Date.now() / 1000) + 60);
    const data = await client.models.Todo.create({
      content: window.prompt('Todo content'),
      devId: '123',
    });

    console.log(data);
  }

  function updateToDo(id: string) {
    client.models.Todo.update({ id, content: window.prompt('Todo content') });
  }

  function updateLog(id: string) {
    client.models.Todo.update({ id, content: window.prompt('log content') });
  }

  function createLogs() {
    client.models.Logs.create({ content: window.prompt('Logs content') });
  }

  function migrateData() {
    client.queries.migrateData({
      sourceTable: window.prompt('source') || '',
      targetTable: window.prompt('target') || '',
    });
  }

  return (
    <main>
      <h1>User Auth My Logs</h1>
      <button onClick={createLogs}>+ new log</button>
      <ul>
        {logs.map(log => (
          <li key={log.id} onClick={() => updateLog(log.id)}>
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
      <h1>Migration Data</h1>
      <button onClick={migrateData}>start</button>
    </main>
  );
};

export default React.memo(App);
