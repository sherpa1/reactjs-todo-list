import {React, useState} from 'react';

import { v4 as uuid } from 'uuid';
import './App.css';

function TaskPreview({ task }) {
  return (
    <article>
      <p>{task.content}</p>
    </article>
  );
}

function TasksMaster() {

  const [tasks,setTasks] = useState([]);
  
  async function add_task(){

    const content_from_prompt = await prompt("Add a new task");

    const newTask = {id:uuid(),completed:false, content:content_from_prompt, date: Date.now()};
    setTasks([tasks,newTask]);
  }

  return (
    <div>
      <button onClick={()=>add_task()}>Add a new task</button>
      {tasks.map(task => <TaskPreview key={task.id} task={task} />)}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TasksMaster />
    </div>
  );
}

export default App;
