import React, { useState } from 'react'

export default function TodoApp() {
  const [inputValue, setInputValue] = useState('')
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [editTaskId, setEditTaskId] = useState(null)
  const [editTaskText, setEditTaskText] = useState('')

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true // 'all' filter
  })

  // Count active tasks
  const activeTasksCount = tasks.filter(task => !task.completed).length

  // Clear completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  // Handle task editing
  const startEdit = (task) => {
    setEditTaskId(task.id)
    setEditTaskText(task.text)
  }

  const saveEdit = () => {
    if (editTaskText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editTaskId ? { ...task, text: editTaskText } : task
      ))
    }
    setEditTaskId(null)
  }

  const cancelEdit = () => {
    setEditTaskId(null)
  }

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

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
        onSubmit={(e) => {
          e.preventDefault()
          if (inputValue.trim()) {
            setTasks([
              ...tasks,
              {
                id: Date.now(),
                text: inputValue,
                completed: false,
              },
            ])
            setInputValue('')
          }
        }}
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
      <nav
        aria-label='Filters'
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setFilter('all')}
          data-filter='all'
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: filter === 'all' ? '#374151' : '#0b1220',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          data-filter='active'
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: filter === 'active' ? '#374151' : '#0b1220',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          data-filter='completed'
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid #374151',
            background: filter === 'completed' ? '#374151' : '#0b1220',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          Completed
        </button>
      </nav>

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
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#1f2937',
                borderRadius: '10px',
                color: '#e5e7eb',
                transition: 'opacity 0.2s',
                opacity: task.completed ? 0.7 : 1,
              }}
            >
              {editTaskId === task.id ? (
                <>
                  <input
                    type='text'
                    value={editTaskText}
                    onChange={(e) => {
                      setEditTaskText(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit()
                      } else if (e.key === 'Escape') {
                        cancelEdit()
                      }
                    }}
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
                    onClick={saveEdit}
                    type='button'
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#22c55e',
                      cursor: 'pointer',
                      marginLeft: '8px',
                    }}
                    title='Save'
                  >
                    ✅
                  </button>
                  <button
                    onClick={cancelEdit}
                    type='button'
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                    title='Cancel'
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <input
                      type='checkbox'
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
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
                      }}
                      onDoubleClick={() => startEdit(task)}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => startEdit(task)}
                      type='button'
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#cbd5e1',
                        cursor: 'pointer',
                        marginRight: '8px',
                      }}
                      title='Edit'
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      type='button'
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                      title='Delete'
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
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
        <span id='count'>{activeTasksCount}</span> {activeTasksCount === 1 ? 'item' : 'items'} left • Double-click a task to edit
      </footer>
    </div>
  )
}
