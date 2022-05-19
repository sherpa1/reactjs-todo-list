import { React, useState } from 'react';
import { useForm } from "react-hook-form";


import { v4 as uuid } from 'uuid';
import './App.css';
import './Form.css';

function TaskPreview({ task }) {
  return (
    <article>
      <p>{task.content}</p>
    </article>
  );
}

function TasksMaster() {

  const [tasks, setTasks] = useState([]);

  async function add_task() {

    const content_from_prompt = await prompt("Add a new task");

    const newTask = { id: uuid(), completed: false, content: content_from_prompt, date: Date.now() };
    setTasks([tasks, newTask]);
  }

  function onAddTask(content){

    const newTask = { id: uuid(), completed: false, content: content, date: Date.now() };

    setTasks([tasks, newTask]);
  }

  return (
    <div>
      <button onClick={() => add_task()}>Add a new task</button>
      <TaskForm onAddTask={onAddTask} />
      {tasks.map(task => <TaskPreview key={task.id} task={task} />)}
    </div>
  );
}

function TaskForm({onAddTask}) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function on_submit(data){
    const {content} = data;

    onAddTask(content);

  }

  return (

    <form onSubmit={handleSubmit(on_submit)}>

      <input {...register("content", { required: true })} />
      <p className='alert'>
        {errors.content && <span>Content is required</span>}
      </p>

      <input type="submit" value="Add" />
    </form>);
}

function App() {
  return (
    <div className="App">
      <TasksMaster />
    </div>
  );
}

export default App;
