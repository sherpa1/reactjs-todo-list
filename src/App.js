import { React, useState } from 'react';
import { useForm } from "react-hook-form";

import { Route, Routes, Link} from "react-router-dom";

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

function AddTask() {

  const [tasks, setTasks] = useState([]);

  function onAddTask(content) {

    const newTask = { id: uuid(), completed: false, content: content, date: Date.now() };

    setTasks([...tasks, newTask]);
  }

  return (
    <TaskForm onAddTask={onAddTask} />
  );
}

function TasksMaster() {

  const [tasks, setTasks] = useState([]);

  async function add_task() {

    const content_from_prompt = await prompt("Add a new task");

    const newTask = { id: uuid(), completed: false, content: content_from_prompt, date: Date.now() };
    setTasks([...tasks, newTask]);
  }

  return (
    <div>
      <button onClick={() => add_task()}>Add a new task</button>
      {tasks.map(task => <TaskPreview key={task.id} task={task} />)}
    </div>
  );
}

function TaskForm({ onAddTask }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function on_submit(data) {
    const { content } = data;

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
      <nav>
        <ul>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
          <li>
            <Link to="/tasks/add">Add</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<TasksMaster />} />
        <Route path="/tasks" element={<TasksMaster />} />
        <Route path="/tasks/add" element={<AddTask />} />
      </Routes>

    </div>
  );
}

export default App;
