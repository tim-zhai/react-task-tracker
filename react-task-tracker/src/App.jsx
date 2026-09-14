import { useState, useEffect } from 'react';

export default function App() {
  // 1. LAZY STATE INITIALIZATION WITH LOCALSTORAGE
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('app_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: 'Master React state and useEffect', completed: true, category: 'Study' },
      { id: 2, text: 'Push Task Tracker project to GitHub', completed: false, category: 'Work' }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [filter, setFilter] = useState('all'); // State string: 'all' | 'active' | 'completed'

  // 2. USEEFFECT: SYNC TASKS TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. HANDLERS
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      category
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    setInputText('');
  };

  const toggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // 4. DERIVED STATE
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Task Tracker</h1>
        <p>{completedCount} of {tasks.length} completed</p>
      </header>

      {/* FORM */}
      <form onSubmit={handleAddTask} style={styles.form}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.input}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
        </select>
        <button type="submit" style={styles.addButton}>Add</button>
      </form>

      {/* FILTER BUTTONS */}
      <div style={styles.filterGroup}>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              fontWeight: filter === f ? 'bold' : 'normal',
              textDecoration: filter === f ? 'underline' : 'none'
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <ul style={styles.list}>
        {filteredTasks.length === 0 ? (
          <li style={styles.empty}>No tasks found.</li>
        ) : (
          filteredTasks.map(task => (
            <li key={task.id} style={styles.item}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#888' : '#000',
                  marginLeft: '8px'
                }}>
                  {task.text}
                </span>
                <small style={styles.badge}>{task.category}</small>
              </label>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// INLINE STYLES
const styles = {
  container: { maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
  header: { textAlign: 'center', marginBottom: '20px' },
  form: { display: 'flex', gap: '8px', marginBottom: '20px' },
  input: { flex: 1, padding: '8px', fontSize: '14px' },
  select: { padding: '8px' },
  addButton: { padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  filterGroup: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' },
  filterBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' },
  list: { listStyle: 'none', padding: 0 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
  label: { display: 'flex', alignItems: 'center', flex: 1 },
  badge: { marginLeft: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' },
  deleteBtn: { background: '#ff4d4f', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#888', fontStyle: 'italic' }
};