import { useEffect, useState } from 'react';

export default function App() {
  const [visits, setVisits] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const load = () => fetch('/api/tasks').then(r => r.json()).then(setTasks);
  useEffect(() => {
    fetch('/api/visits').then(r => r.json()).then(d => setVisits(d.visits));
    load();
  }, []);
  const add = async () => {
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    setTitle(''); load();
  };
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '40px auto' }}>
      <h2>Lab2 Task Tracker</h2>
      <p>Visitors: {visits}</p>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>{tasks.map(t => <li key={t._id}>{t.title}</li>)}</ul>
    </div>
  );
}