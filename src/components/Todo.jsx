import React, { useState, useCallback, useMemo, useEffect } from 'react'

// Task Item Component (memoized to prevent unnecessary re-renders)
const TaskItem = React.memo(({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onEdit(task.id, editText)
      setIsEditing(false)
    }
  }, [editText, task.id, onEdit])

  const handleCancel = useCallback(() => {
    setEditText(task.text)
    setIsEditing(false)
  }, [task.text])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  useEffect(() => {
    setEditText(task.text)
  }, [task.text])

  if (isEditing) {
    return (
      <li
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          background: '#1f2937',
          borderRadius: '10px',
          color: '#e5e7eb',
          gap: '8px',
        }}
      >
        <input
          type='text'
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #374151',
            background: '#0b1220',
            color: '#e5e7eb',
          }}
        />
        <button
          onClick={handleSave}
          type='button'
          style={{
            background: 'transparent',
            border: 'none',
            color: '#22c55e',
            cursor: 'pointer',
            padding: '4px',
          }}
          title='Save'
        >
          ✅
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()} // جلوی blur گرفتن
          onClick={handleCancel}
          type='button'
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px',
          }}
          title='Cancel'
        >
          ❌
        </button>
      </li>
    )
  }

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: '#1f2937',
        borderRadius: '10px',
        color: '#e5e7eb',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <input
          type='checkbox'
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          style={{
            marginRight: '10px',
            cursor: 'pointer',
            width: '18px',
            height: '18px',
          }}
        />
        <span
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#94a3b8' : '#e5e7eb',
            cursor: 'pointer',
          }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {task.text}
        </span>
      </div>
      <div>
        <button
          onClick={() => setIsEditing(true)}
          type='button'
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            marginRight: '8px',
            padding: '4px',
          }}
          title='Edit'
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task.id)}
          type='button'
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px',
          }}
          title='Delete'
        >
          🗑️
        </button>
      </div>
    </li>
  )
})

// Filter Buttons Component
const FilterButtons = React.memo(({ filter, setFilter }) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <nav
      aria-label='Filters'
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}
    >
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          data-filter={key}
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: filter === key ? '#374151' : '#0b1220',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  )
})

// Main TodoApp Component
export default function TodoApp() {
  const [inputValue, setInputValue] = useState('')
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage if available
    try {
      const savedTasks = localStorage.getItem('todoTasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('all')

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks))
  }, [tasks])

  // Filter tasks based on current filter
  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [tasks, filter])

  // Count active tasks
  const activeTasksCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  )

  // Add new task
  const addTask = useCallback(
    (e) => {
      e.preventDefault()
      if (inputValue.trim()) {
        setTasks((prevTasks) => [
          ...prevTasks,
          {
            id: Date.now(),
            text: inputValue,
            completed: false,
          },
        ])
        setInputValue('')
      }
    },
    [inputValue]
  )

  // Toggle task completion
  const toggleTask = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  // Delete task
  const deleteTask = useCallback((id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }, [])

  // Edit task text
  const editTask = useCallback((id, newText) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    )
  }, [])

  // Clear completed tasks
  const clearCompleted = useCallback(() => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed))
  }, [])

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '48px auto',
        padding: '24px',
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '14px',
        boxShadow: '0 10px 30px rgba(0,0,0,.35)',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          color: 'white',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', letterSpacing: '.3px' }}>
          📝 To-Do
        </h1>
        <button
          id='clearDone'
          type='button'
          title='Remove all completed tasks'
          onClick={clearCompleted}
          style={{
            border: '1px solid #374151',
            background: '#0b1220',
            color: '#cbd5e1',
            padding: '10px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform .05s',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Clear completed
        </button>
      </header>

      {/* Add new task */}
      <form
        onSubmit={addTask}
        id='addForm'
        autoComplete='off'
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <label
          htmlFor='taskInput'
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          New task
        </label>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          id='taskInput'
          name='task'
          type='text'
          required
          placeholder='What needs to be done?'
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #374151',
            background: '#0b1220',
            color: '#e5e7eb',
            outline: 'none',
          }}
        />
        <button
          type='submit'
          style={{
            padding: '12px 16px',
            border: 0,
            borderRadius: '12px',
            background: '#22c55e',
            color: '#052e16',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity .15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          Add
        </button>
      </form>

      {/* Filters */}
      <FilterButtons filter={filter} setFilter={setFilter} />

      {/* List */}
      <ul
        id='list'
        aria-live='polite'
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minHeight: '50px',
        }}
      >
        {filteredTasks.length === 0 ? (
          <li
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#94a3b8',
              fontStyle: 'italic',
              background: '#1f2937',
              borderRadius: '10px',
            }}
          >
            {filter === 'all'
              ? 'No tasks yet. Add a new task above!'
              : filter === 'active'
              ? 'No active tasks. Great job!'
              : 'No completed tasks yet.'}
          </li>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))
        )}
      </ul>

      {/* Footer */}
      <footer
        style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#94a3b8',
        }}
      >
        <span id='count'>{activeTasksCount}</span>{' '}
        {activeTasksCount === 1 ? 'item' : 'items'} left • Double-click a task
        to edit
      </footer>
    </div>
  )
}
