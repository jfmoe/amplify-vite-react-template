import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'


const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [logs, setLogs] = useState<Array<Schema["Logs"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    client.models.Logs.observeQuery().subscribe({
      next: (data) => setLogs([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), devId: "123" });
  }

  function deleteToDo(id: string) {
    client.models.Todo.delete({ id });
  }

  function deleteLog(id: string) {
    client.models.Todo.delete({ id });
  }

  function createLogs() {
    client.models.Logs.create({ content: window.prompt("Logs content") });
  }

  return (
    <Authenticator>

      {( { signOut }) => (
          <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteToDo(todo.id)}>{todo.content}</li>
            ))}
          </ul>
          <h1>My Logs</h1>
          <button onClick={createLogs}>+ new log</button>
          <ul>
            {logs.map((log) => (
              <li key={log.id} onClick={() => deleteLog(log.id)}>{log.content}</li>
            ))}
          </ul>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
