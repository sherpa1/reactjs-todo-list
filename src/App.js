import {React, useState} from 'react';

import { v4 as uuid } from 'uuid';
import './App.css';

const data = [
  {
    id: uuid(),
    completed: false,
    content: "Sortir le chien",
    date: "2022-05-15"
  }, {
    id: uuid(),
    completed: false,
    content: "Faire les courses",
    date: "2022-05-19"
  }, {
    id: uuid(),
    completed: false,
    content: "Préparer à manger",
    date: "2022-05-18"
  }, {
    id: uuid(),
    completed: true,
    content: "Acheter des fleurs à ma femme",
    date: "2022-05-19"
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

  
  function add_task(){

    const newTask = {id:uuid(),completed:false, content:"Test", date:"2022-05-19"};
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
