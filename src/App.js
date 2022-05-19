import {React, useState} from 'react';

import { v4 as uuid } from 'uuid';
import './App.css';

const data = [
  {
    id: uuid(),
    completed: false,
    content: "Sortir le chien",
    date: new Date()
  }, {
    id: uuid(),
    completed: false,
    content: "Faire les courses",
    date: new Date()
  }, {
    id: uuid(),
    completed: false,
    content: "Préparer à manger",
    date: new Date()
  }, {
    id: uuid(),
    completed: true,
    content: "Acheter des fleurs à ma femme",
    date: new Date()
  },
];

function TaskPreview({ task }) {
  return (
    <article>
      <p>{task.content}</p>
    </article>
  );
}

function TasksMaster({ data }) {

  const [tasks,setTasks] = useState(data);

  
  async function add_task(){

    const content_from_prompt = await prompt("Add a new task");

    const newTask = {id:uuid(),completed:false, content:content_from_prompt, date: new Date()};
    setTasks([...tasks,newTask]);
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
      <TasksMaster data={data} />
    </div>
  );
}

export default App;
