import { useState, useEffect } from 'react';

export default function App() {
  // LAZY STATE INITIALIZATION WITH LOCALSTORAGE, ensures getItem is not run every render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('app_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [ //if savedTasks is not empty, convert to object, else, populate with generic task
      { id: 1, text: 'Master React state and useEffect', completed: true, category: 'Study' },
      { id: 2, text: 'Push Task Tracker project to GitHub', completed: false, category: 'Work' }
    ];
  });

  const [inputText, setInputText] = useState('');//track user input
  const [category, setCategory] = useState('Personal');//track selected category
  const [filter, setFilter] = useState('all'); // State string: 'all' | 'active' | 'completed'

  // USEEFFECT: SYNC TASKS TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));//creates/updates key: value pair
  }, [tasks]);//whenever tasks changes, update this change in localstorage

  // HANDLERS
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;//if no input

    const newTask = {
      id: Date.now(),//unique id
      text: inputText.trim(),//take user input
      completed: false,//activity default value is false
      category
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);//prepend new task to the task array
    setInputText('');//clear the user input for the next input
  };

  const toggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )//searches the task array for the toggled task (check by id) and flips the value of its completed field
    );
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };//searches the task array for the deleted task (check by id) and excludes it from the new task array

  // DERIVED STATE
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;//return all active tasks (active tasks mean its completed field is FALSE, so !FALSE = TRUE
    if (filter === 'completed') return task.completed;//return all completed tasks as its completed field is TRUE
    return true; // if not active and not completed, then returns all tasks in the array
  });

  const completedCount = tasks.filter(t => t.completed).length;//length of task array with all completed tasks

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