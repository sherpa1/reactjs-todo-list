import { React, useState, useContext, createContext } from 'react';
import { useForm } from "react-hook-form";

import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";

import { v4 as uuid } from 'uuid';
import './css/App.css';
import './css/Form.css';
import './css/icons.css';
import './css/buttons.css';
import './css/TaskPreview.css';

//context is a way to share state between multiple components like a local DB 
const TasksContext = createContext(
  { tasks: [], setTasks: {} }
);


// components ending with "Screen" are dedicated to rooting
function HomeScreen() {
  return (
    <section>
      <TasksMaster />
    </section>
  );
}

function AddScreen() {

  return (
    <section>
      <h1>Add a new Task</h1>
      <AddTaskForm />
    </section>

  );
}

function EditScreen() {

  const location = useLocation();
  const { task } = location.state;//get data from route state

  return (
    <section>
      <h1>Edit Task</h1>
      <h2>{task.id}</h2>

      <EditTaskForm task={task} />
    </section>
  );
}

function SingleScreen() {

  const location = useLocation();
  const { task } = location.state;//get data from route state

  return (
    <section>
      <TaskDetails task={task} />
    </section>
  );
}

function TaskDetails({ task }) {

  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  async function confirm_delete(id) {
    const delete_confirmation = await window.confirm(`Do you really want to delete task "${id}" ?`);

    if (delete_confirmation) {
      const tasks_without_deleted_task = tasks.filter(a_task => a_task.id !== id);
      setTasks(tasks_without_deleted_task);
      navigate('/tasks');
    }
  }

  return (
    <div>
      <h1>Task</h1>
      <h2>{task.id}</h2>
      <p>
        Created at : {new Date(task.date).toLocaleString()}
      </p>
      <blockquote>{task.content}</blockquote>
      <p>
        Status : {task.completed ? 'Completed' : 'Not completed'}
      </p>

      <footer>
        <Link to={`/tasks/${task.id}/edit`} state={{ task: task }}>
          <button className='button button-outline'><span class="material-icons">edit</span>

          </button>
        </Link>
        <button className='button button-outline danger' onClick={() => confirm_delete(task.id)}><span class="material-icons">delete</span>

        </button>
      </footer>
    </div>
  );
}

function TaskPreview({ task }) {

  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  async function confirm_delete(id) {

    const delete_confirmation = await window.confirm(`Do you really want to delete task "${id}" ?`);

    if (delete_confirmation) {
      const tasks_without_deleted_task = tasks.filter(a_task => a_task.id !== id);
      setTasks(tasks_without_deleted_task);
      navigate('/tasks');
    }
  }

  return (
    <article className='TaskPreview'>
      <blockquote className={task.completed ? "completed" : null}>
        <Link to={`/tasks/${task.id}`} state={{ task: task }}>
          {task.content}
          {task.completed ? <span class="material-icons green">check</span> : null}
        </Link>
      </blockquote>
      <footer>
        <Link to={`/tasks/${task.id}/edit`} state={{ task: task }}>
          <button className='button button-outline'><span class="material-icons">edit</span>

          </button>
        </Link>
        <button className='button button-outline danger' onClick={() => confirm_delete(task.id)}><span class="material-icons">delete</span>

        </button>
      </footer>
    </article>
  );
}

function TasksMaster() {

  return (
    <TasksContext.Consumer>
      {({ tasks }) => (
        <div>
          <h1>All Tasks</h1>
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

function AddTaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { tasks, setTasks } = useContext(TasksContext);
  const navigate = useNavigate();

  function on_submit(data) {
    const { content } = data;
    const newTask = { id: uuid(), completed: false, content: content, date: Date.now() };

    setTasks([...tasks, newTask]);

    navigate('/tasks');
  }

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      <form onSubmit={handleSubmit(on_submit)}>
        <input placeholder='Content' {...register("content", { required: true })} />
        <p className='alert'>
          {errors.content && <span>Content is required</span>}
        </p>

        {/* <input type="submit" value="Add" /> */}
        <button className='button success'><span class="material-icons">check</span> Save</button>
      </form>
    </TasksContext.Provider>
  );
}

function EditTaskForm({ task }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { tasks, setTasks } = useContext(TasksContext);

  //deal the Task completed attr with a local state
  const [completed, setCompleted] = useState(task.completed);

  const navigate = useNavigate();

  function on_submit(data) {
    const { content } = data;
    const updatedTask = { id: task.id, completed: completed, content: content, date: task.date };

    const index = tasks.findIndex(a_task => a_task.id === task.id);
    tasks[index] = updatedTask;

    setTasks(tasks);

    navigate('/tasks');

  }

  function on_click() {
    setCompleted(completed ? false : true);
  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <input {...register("content", { required: true, value: task.content })} />
      <p className='alert'>
        {errors.content && <span>Content is required</span>}
      </p>

      <p>
        <label className='inline-label'>Completed ?</label>
        <input onClick={() => on_click()} defaultChecked={completed ? "checked" : null} type="checkbox" />
      </p>

      <button className='button success'><span class="material-icons">check</span>

      </button>
    </form>
  );
}

function App() {

  const [tasks, setTasks] = useState([]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>

      <div className="App container">
        <nav>
          <ul>
            <li>
              <Link to="/tasks">All Tasks</Link>
            </li>
            <li>
              <Link to="/tasks/add">Add a new Task</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/tasks" element={<HomeScreen />} />
          <Route path="/tasks/add" element={<AddScreen />} />
          <Route path="/tasks/:id" element={<SingleScreen />} />
          <Route path="/tasks/:id/edit" element={<EditScreen />} />
        </Routes>

      </div>
    </TasksContext.Provider>
  );
}

export default App;
