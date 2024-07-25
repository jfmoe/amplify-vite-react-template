import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css'
import { signIn, signOut, getCurrentUser } from "aws-amplify/auth";


const client = generateClient<Schema>();
const App: React.FC = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [logs, setLogs] = useState<Array<Schema["Logs"]["type"]>>([]);
  const [isSignIn, setIsSignIn] = useState(false);

  const fetchData = () => {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });
  
      client.models.Logs.observeQuery().subscribe({
        next: (data) => setLogs([...data.items]),
      });
    } catch (e) {
      console.warn(e);
     }
  }

  const authSign = async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log('username', username, userId, signInDetails);

      if (userId) {
        setIsSignIn(true);
        fetchData();
      }

    } catch (e) {

      console.warn(e);

      const nextStep = await signIn({
        username: "luolin.tong@tuya.com",
        password: "Ambit123!",
      })

      const { isSignedIn } = nextStep;

      console.log('nextStep', nextStep, isSignedIn);

      if (isSignedIn) {
        setIsSignIn(true);
        fetchData();
      }
      
    }
  }


  const authSignOut = async () => {
    try {
      await signOut();
      setIsSignIn(false);
    } catch (e) {
      console.warn(e);
    }
  }


  useEffect(() => {
    authSign();

    return () => {
      authSignOut();
    }

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

  return (<div>
      {isSignIn ? (
        <main>
          <h1>User Auth My Logs</h1>
          <button onClick={createLogs}>+ new log</button>
          <ul>
            {logs.map((log) => (
              <li key={log.id} onClick={() => deleteLog(log.id)}>{log.content}</li>
            ))}
          </ul>
          <button onClick={() => authSignOut()}>Sign out</button>
        </main>) 
      : (<main>
        <h1>Public Auth My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteToDo(todo.id)}>{todo.content}</li>
            ))}
          </ul>
      </main>) }
  </div>
  );
}

export default React.memo(App);
