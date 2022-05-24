import { React, useState, useContext, useEffect, createContext } from 'react';
import { useForm } from "react-hook-form";

import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';

import { v4 as uuid } from 'uuid';

import './css/App.css';
import './css/buttons.css';
import './css/Form.css';
import './css/Footer.css';
import './css/Header.css';
import './css/icons.css';
import './css/TaskPreview.css';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;

//context is a way to share state between multiple components like a local DB 
const TasksContext = createContext(
  { tasks: [], setTasks: {} }
);

// all components with name ending with "Screen" are only "containers" dedicated to rooting
function HomeScreen() {
  return (
    <section>
      <TasksMaster />
    </section>
  );
}

//Create a Task
function AddScreen() {
  return (
    <section>
      <h2>Add a new Task</h2>
      <AddTaskForm />
    </section>
  );

}

//Read a Task
function SingleScreen() {

  const location = useLocation();
  const { task } = location.state;//get data from route state

  return (
    <section>
      <TaskDetails task={task} />
    </section>
  );
}

//Update a Task
function EditScreen() {

  const location = useLocation();
  const { task } = location.state;//get data from route state

  return (
    <section>
      <h2>Edit Task</h2>
      <h3>{task.id}</h3>

      <EditTaskForm task={task} />
    </section>
  );
}

//Task Details (inside Single Screen)
function TaskDetails({ task }) {

  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  async function confirm_delete(id) {
    const delete_confirmation = await window.confirm(`Do you really want to delete task "${id}" ?`);

    if (delete_confirmation) {
      const tasks_without_deleted_task = tasks.filter(a_task => a_task.id !== id);

      const result = await axios.delete(ENDPOINT + id);

      if (result.status === 204) {

        setTasks(tasks_without_deleted_task);
        navigate('/tasks');

      } else {
        alert("Can't reach API");
      }

    }
  }

  return (
    <div>
      <h2>Task</h2>
      <h3>{task.id}</h3>
      {
        task.created ?
          <p>
            Created at : {new Date(task.created).toDateString()}
          </p>
          :
          null
      }
      {
        task.updated ?
          <p>
            Updated at : {new Date(task.updated).toDateString()}
          </p>
          : null
      }
      <blockquote>{task.content}</blockquote>
      <p>
        Status : {task.completed ? 'Completed' : 'Not completed'}
      </p>

      <footer>
        <Link to={`/tasks/${task.id}/edit`} state={{ task: task }}>
          <button className='button button-outline'><span className="material-icons">edit</span>

          </button>
        </Link>
        <button className='button button-outline danger' onClick={() => confirm_delete(task.id)}><span className="material-icons">delete</span>

        </button>
      </footer>
    </div>
  );
}

//Task Preview (inside Task Master)
function TaskPreview({ task }) {

  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  async function confirm_delete(id) {
    const delete_confirmation = await window.confirm(`Do you really want to delete task "${id}" ?`);

    if (delete_confirmation) {
      const tasks_without_deleted_task = tasks.filter(a_task => a_task.id !== id);

      const result = await axios.delete(ENDPOINT + id);

      if (result.status === 204) {

        setTasks(tasks_without_deleted_task);
        navigate('/tasks');

      } else {
        alert("Can't reach API");
      }

    }
  }

  return (
    <article className='TaskPreview'>
      <blockquote className={task.completed ? "completed" : null}>
        <Link to={`/tasks/${task.id}`} state={{ task: task }}>
          {task.content}
          {task.completed ? <span className="material-icons green">check</span> : null}
        </Link>
      </blockquote>
      <footer>
        <Link to={`/tasks/${task.id}/edit`} state={{ task: task }}>
          <button className='button button-outline'><span className="material-icons">edit</span>

          </button>
        </Link>
        <button className='button button-outline danger' onClick={() => confirm_delete(task.id)}><span className="material-icons">delete</span>

        </button>
      </footer>
    </article>
  );
}

//Tasks list (inside Home Screen)
function TasksMaster() {

  return (
    <TasksContext.Consumer>
      {({ tasks }) => (
        <div>
          <h2>All Tasks</h2>
          {
            tasks.map(task => <TaskPreview key={task.id} task={task} />)
          }
          {
            (tasks.length === 0) ? <p>No Task at the moment</p> : null
          }
        </div>
      )}
    </TasksContext.Consumer>

  );
}

//Task Form (inside Add Screen)
function AddTaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  async function on_submit(data) {

    const { content } = data;//extracts "content" field value from submited data

    const newTask = { id: uuid(), completed: false, content: content };

    try {
      const result = await axios.post(ENDPOINT, newTask);

      if (result.status === 200 && result.statusText === "OK") {

        setTasks([...tasks, newTask]);

        navigate('/tasks');
      } else {
        alert("Can't reach API");
      }

    } catch (error) {
      console.error(error);
    }

  }

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <form onSubmit={handleSubmit(on_submit)}>
        <input placeholder='Content' {...register("content", { required: true })} />
        <p className='alert'>
          {errors.content && <span>Content is required</span>}
        </p>

        <button className='button success'><span className="material-icons">check</span> <span>save</span></button>
      </form>
    </TasksContext.Provider>
  );
}

//Task Form (inside Edit Screen)
function EditTaskForm({ task }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { tasks, setTasks } = useContext(TasksContext);

  //deal the Task completed attr with a local state called "done"
  const [done, setDone] = useState(task.completed);

  const navigate = useNavigate();

  async function on_submit(data) {
    const { content } = data;
    const updatedTask = { id: task.id, completed: done, content: content };

    const index = tasks.findIndex(a_task => a_task.id === task.id);
    tasks[index] = updatedTask;

    try {
      const result = await axios.patch(ENDPOINT + updatedTask.id, updatedTask);

      if (result.status === 200 && result.statusText === "OK") {

        setTasks(tasks);

        navigate('/tasks');

      } else {
        alert("Can't reach API");
      }

    } catch (error) {
      console.error(error);
    }

  }

  function on_click() {
    setDone(done ? false : true);
  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <input {...register("content", { required: true, value: task.content })} />
      <p className='alert'>
        {errors.content && <span>Content is required</span>}
      </p>

      <p>
        <label className='inline-label'>Completed ?</label>
        <input onClick={() => on_click()} defaultChecked={done ? "checked" : null} type="checkbox" />
      </p>

      <button className='button edit'><span className="material-icons">update</span>
        <span>update</span>
      </button>
    </form>
  );
}

//Main Component
function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    async function fetch_tasks() {
      const response = await axios.get(ENDPOINT);
      setTasks(response.data.data);
    }

    fetch_tasks();

  }, []);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>

      <div className="App container">

        <header>

          <h1>Todo List</h1>

          <Link to="/tasks">
            <img src='/logo192.png' alt="logo" height="192px" />
          </Link>

          <nav>
            <Link className='button' to="/tasks">All Tasks</Link>
            <Link className='button' to="/tasks/add">Add a new Task</Link>
          </nav>
        </header>

        <main>

          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/tasks" element={<HomeScreen />} />
            <Route path="/tasks/add" element={<AddScreen />} />
            <Route path="/tasks/:id" element={<SingleScreen />} />
            <Route path="/tasks/:id/edit" element={<EditScreen />} />
          </Routes>
        </main>

        <footer>
          <p>Todo List - Alexandre Leroux (alex@sherpa.one)</p>
        </footer>

      </div>
    </TasksContext.Provider>
  );
}

export default App;

//Todo : merge EditTaskForm and AddTaskForm
//Todo : create only one method "confirm_delete" (code duplication)
//Todo : better deal API interactions
//Todo : organize each component in separated files