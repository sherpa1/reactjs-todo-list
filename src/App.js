import { v4 as uuid } from 'uuid';
import './App.css';

const data = [
  {
    id:uuid(),
    completed:false,
    content: "Sortir le chien",
    date : "2022-05-15"
  },  {
    id:uuid(),
    completed:false,
    content: "Faire les courses",
    date : "2022-05-19"
  },  {
    id:uuid(),
    completed:false,
    content: "Préparer à manger",
    date : "2022-05-18"
  },  {
    id:uuid(),
    completed:true,
    content: "Acheter des fleurs à ma femme",
    date : "2022-05-19"
  },
];

function TaskPreview({task}){
  return (
    <article>
      <p>{task.content}</p>
    </article>
  );
}

function TasksMaster({tasks}){
  return (
    <div>
    {tasks.map(task=><TaskPreview key={task.id} task={task}/>)}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TasksMaster tasks={data} />
    </div>
  );
}

export default App;
