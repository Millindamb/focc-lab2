import { useEffect, useState } from 'react';

export default function App() {
  const [visits, setVisits] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const r = await fetch('/api/tasks');
      setTasks(await r.json());
      setOnline(true);
    } catch {
      setOnline(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch('/api/visits').then(r => r.json()).then(d => setVisits(d.visits)).catch(() => {});
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setError('');
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t }),
      });
      setTitle('');
      load();
    } catch {
      setError('Could not save the task. Please try again.');
    }
  };

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">FoCC Lab 2 | MERN on Azure AKS</p>
          <h1>Task Tracker</h1>
        </div>
        <span className={`pill ${online === false ? 'bad' : ''}`}>
          <i /> {online === null ? 'Connecting' : online ? 'API online' : 'API offline'}
        </span>
      </header>

      <section className="stats">
        <div className="card stat"><span>Visitors</span><strong>{visits ?? '-'}</strong></div>
        <div className="card stat"><span>Tasks</span><strong>{tasks.length}</strong></div>
      </section>

      <section className="card">
        <form className="add" onSubmit={add}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={120}
            aria-label="New task"
          />
          <button type="submit" disabled={!title.trim()}>Add task</button>
        </form>
        {error && <p className="err">{error}</p>}
        {loading ? (
          <p className="muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="muted empty">No tasks yet. Add your first one above.</p>
        ) : (
          <ul className="list">
            {[...tasks].reverse().map(t => (
              <li key={t._id}><span className="dot" />{t.title}</li>
            ))}
          </ul>
        )}
      </section>

      <footer>Served by Express | Stored in MongoDB | Autoscaled by Kubernetes HPA</footer>
    </main>
  );
}