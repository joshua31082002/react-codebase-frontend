import { useEffect, useMemo, useState } from 'react'
import { Check, Circle, ListFilter, Plus, Sparkles, Trash2 } from 'lucide-react'

type Todo = {
  id: string
  title: string
  completed: boolean
  category: 'Work' | 'Personal' | 'Ideas'
}

type Filter = 'All' | 'Active' | 'Completed'

const starterTodos: Todo[] = [
  { id: '1', title: 'Review project proposal', completed: false, category: 'Work' },
  { id: '2', title: 'Book a table for Friday', completed: false, category: 'Personal' },
  { id: '3', title: 'Explore inspiration for the new site', completed: true, category: 'Ideas' },
]

const categoryColors: Record<Todo['category'], string> = {
  Work: 'tag-work',
  Personal: 'tag-personal',
  Ideas: 'tag-ideas',
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('today-todos')
    return saved ? (JSON.parse(saved) as Todo[]) : starterTodos
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  useEffect(() => {
    localStorage.setItem('today-todos', JSON.stringify(todos))
  }, [todos])

  const remaining = todos.filter((todo) => !todo.completed).length
  const visibleTodos = useMemo(() => {
    if (filter === 'Active') return todos.filter((todo) => !todo.completed)
    if (filter === 'Completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [filter, todos])

  function addTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = input.trim()
    if (!title) return
    setTodos((current) => [
      ...current,
      { id: crypto.randomUUID(), title, completed: false, category: 'Work' },
    ])
    setInput('')
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="todo-card" aria-labelledby="page-title">
        <header className="hero">
          <div className="brand-mark" aria-hidden="true"><Sparkles size={19} strokeWidth={2.5} /></div>
          <div>
            <p className="eyebrow">A little clarity</p>
            <h1 id="page-title">Today<span className="dot">.</span></h1>
          </div>
          <div className="date-pill">Tuesday, Apr 16</div>
        </header>

        <div className="intro-row">
          <div>
            <p className="greeting">Good morning, Alex</p>
            <p className="summary">You have <strong>{remaining} {remaining === 1 ? 'thing' : 'things'}</strong> left to focus on.</p>
          </div>
          <div className="progress-ring" style={{ '--progress': `${todos.length ? ((todos.length - remaining) / todos.length) * 100 : 0}%` } as React.CSSProperties}>
            <span>{todos.length ? Math.round(((todos.length - remaining) / todos.length) * 100) : 0}%</span>
          </div>
        </div>

        <form className="add-form" onSubmit={addTodo}>
          <Plus size={20} aria-hidden="true" />
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Add something to your day..." aria-label="New todo" />
          <button type="submit" disabled={!input.trim()}>Add</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="group" aria-label="Filter todos">
            {(['All', 'Active', 'Completed'] as Filter[]).map((option) => (
              <button key={option} className={filter === option ? 'filter active' : 'filter'} onClick={() => setFilter(option)} type="button">
                {option}
                {option === 'All' && <span className="filter-count">{todos.length}</span>}
              </button>
            ))}
          </div>
          <span className="list-label"><ListFilter size={15} /> {visibleTodos.length} shown</span>
        </div>

        <div className="todo-list">
          {visibleTodos.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"><Check size={21} /></div><p>Nothing here yet</p><span>Enjoy the quiet moment.</span></div>
          ) : visibleTodos.map((todo) => (
            <article className={todo.completed ? 'todo-item completed' : 'todo-item'} key={todo.id}>
              <button className="check-button" type="button" onClick={() => toggleTodo(todo.id)} aria-label={todo.completed ? `Mark ${todo.title} active` : `Complete ${todo.title}`}>
                {todo.completed ? <Check size={16} strokeWidth={3} /> : <Circle size={20} />}
              </button>
              <div className="todo-content"><p>{todo.title}</p><span className={`tag ${categoryColors[todo.category]}`}>{todo.category}</span></div>
              <button className="delete-button" type="button" onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}><Trash2 size={17} /></button>
            </article>
          ))}
        </div>

        <footer><span>Small steps add up.</span><span className="footer-dot" /> <span>{remaining === 0 ? 'All done for today' : 'One thing at a time'}</span></footer>
      </section>
    </main>
  )
}

export default App
