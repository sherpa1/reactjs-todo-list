import { React, useState, useContext, createContext, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { Route, Routes, Link, useLocation } from "react-router-dom";

import { v4 as uuid } from 'uuid';
import './App.css';
import './Form.css';

import axios from 'axios';

const TasksContext = createContext(
  { tasks: [], setTasks: {} }
);

function StaredTask({task}){
  return (
    <div>
      <p>This task is the most important</p>
      <strong>{task.content}</strong>
    </div>
  );
}

function TaskPreview({ task }) {
  return (
    <article>
      <p>{task.content}</p>
      <Link to={"/tasks/"+task.id+"/edit"} state={{ task: task }}>
        <button>Edit</button>
      </Link>
    </article>
  );
}

function AddTaskScreen() {

  const { tasks, setTasks } = useContext(TasksContext);

  function onAddTask(content) {

    const newTask = { id: uuid(), completed: false, content: content, date: Date.now() };

    setTasks([...tasks, newTask]);
  }

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <div>
        <ul>
          {tasks.map(task => <li key={task.id}>{task.content}</li>)}
        </ul>
        <AddTaskForm onAddTask={onAddTask} />
      </div>
    </TasksContext.Provider>

  );
}

function EditTaskScreen() {

  const { tasks, setTasks } = useContext(TasksContext);

  const location = useLocation();
  const { task } = location.state;//get data from route state

  function onEditTask(updated_content) {

    const index = tasks.findIndex(a_task => task.id === a_task.id);
    
    const newTasks = tasks;//copy the tasks

    const updated_task = task;//copy the current task (to be updated)

    updated_task.id = uuid();
    updated_task.content = updated_content;//set the new content value

    newTasks[index] = updated_task;//update the task at its index

    setTasks(newTasks);//update state
  }

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <div>
        <EditTaskForm task={task} onEditTask={onEditTask} />
      </div>
    </TasksContext.Provider>

  );
}

function AllTasksScreen() {

  return (
    <TasksContext.Consumer>
      {({ tasks }) => (
        <div>
          {tasks.map(task => <TaskPreview key={task.id} task={task} />)}
        </div>
      )}
    </TasksContext.Consumer>
  );
}

function AddTaskForm({ onAddTask }) {
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

function EditTaskForm({ onEditTask, task }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  function on_submit(data) {
    const { content } = data;

    onEditTask(content);

  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <input {...register("content", { required: true, defaultValue:task.content, value:task.content })} />
      <p className='alert'>
        {errors.content && <span>Content is required</span>}
      </p>

      <input type="submit" value="Update" />
    </form>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    async function fetch_tasks_from_api(){
      try {
        const response = await axios.get("https://8s0fqfqq.directus.app/items/tasks");
        const fetched_data = response.data.data;
        setTasks(fetched_data);
      } catch (error) {
        console.error(error);
        setTasks([]);
      }
    }

    fetch_tasks_from_api();


  }, []);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
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

        {
          tasks.length>0? <StaredTask task={tasks[0]}/> : <p>No task at the moment :(</p>
        }

        <Routes>
          <Route path="/" element={<AllTasksScreen />} />
          <Route path="/tasks" element={<AllTasksScreen />} />
          <Route path="/tasks/add" element={<AddTaskScreen />} />
          <Route path="/tasks/:id/edit" element={<EditTaskScreen />} />
        </Routes>

      </div>
    </TasksContext.Provider>
  );
}

export default App;
