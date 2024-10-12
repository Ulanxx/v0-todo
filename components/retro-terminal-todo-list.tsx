"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

type Priority = 'low' | 'medium' | 'high'

type Subtask = {
  id: number
  text: string
  completed: boolean
}

type Task = {
  id: number
  text: string
  status: 'todo' | 'done'
  subtasks: Subtask[]
  expanded: boolean
  priority: Priority
}

export function RetroTerminalTodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newSubtask, setNewSubtask] = useState('')

  useEffect(() => {
    const storedTasks = localStorage.getItem('todo-tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem: Task = { 
        id: Date.now(), 
        text: newTask, 
        status: 'todo', 
        subtasks: [], 
        expanded: false,
        priority: newTaskPriority
      }
      const updatedTasks = [...tasks, newTaskItem]
      setTasks(updatedTasks)
      localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
      setNewTask('')
      setNewTaskPriority('medium')
    }
  }

  const addSubtask = (taskId: number) => {
    if (newSubtask.trim()) {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), text: newSubtask, completed: false }] }
          : task
      )
      setTasks(updatedTasks)
      localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
      setNewSubtask('')
    }
  }

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
  }

  const deleteSubtask = (taskId: number, subtaskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
        : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
  }

  const completeTask = (task: Task) => {
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, status: 'done', subtasks: t.subtasks.map(st => ({ ...st, completed: true })) } : t
    )
    setTasks(updatedTasks as Task[])
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
  }

  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
  }

  const updateTask = (id: number, newText: string, newPriority: Priority) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText, priority: newPriority } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
    setEditingTask(null)
  }

  const toggleExpanded = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, expanded: !task.expanded } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('todo-tasks', JSON.stringify(updatedTasks))
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-white'
    }
  }

  const getPrioritySymbol = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '▲'
      case 'medium':
        return '■'
      case 'low':
        return '▼'
      default:
        return '●'
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ╔═══════════════════════════════╗
          <br />
          ║&nbsp;&nbsp;&nbsp;&nbsp;Muzhi TODO LIST&nbsp;&nbsp;&nbsp;&nbsp;║
          <br />
          ╚═══════════════════════════════╝
        </motion.h1>
        
        <motion.div 
          className="mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <span className="mr-2">$</span>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-grow bg-black border-b border-green-500 text-green-500 text-base focus:outline-none"
              placeholder="输入新任务..."
            />
          </div>
          <div className="flex items-center mb-2">
            <span className="mr-2">优先级:</span>
            <select 
              value={newTaskPriority} 
              onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              className="bg-black text-green-500 border border-green-500 p-1"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <button 
              onClick={addTask} 
              className="ml-4 px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
            >
              添加任务
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">[ 待完成任务 ]</h2>
            <AnimatePresence>
              {tasks.filter(task => task.status === 'todo').map(task => (
                <motion.div 
                  key={task.id} 
                  className="mb-4 border border-green-500 p-2"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    {editingTask && editingTask.id === task.id ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="text"
                          value={editingTask.text}
                          onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                          className="flex-grow bg-black border-b border-green-500 text-green-500 text-sm focus:outline-none"
                          autoFocus
                        />
                        <select 
                          value={editingTask.priority} 
                          onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as Priority})}
                          className="bg-black text-green-500 border border-green-500 p-1"
                        >
                          <option value="low">低</option>
                          <option value="medium">中</option>
                          <option value="high">高</option>
                        </select>
                        <button 
                          onClick={() => updateTask(task.id, editingTask.text, editingTask.priority)}
                          className="px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        >
                          保存
                        </button>
                      </div>
                    ) : (
                      <span className={`text-base flex items-center ${getPriorityColor(task.priority)}`}>
                        {getPrioritySymbol(task.priority)} {task.text}
                      </span>
                    )}
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toggleExpanded(task.id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        {task.expanded ? '[-]' : '[+]'}
                      </button>
                      <button 
                        onClick={() => completeTask(task)}
                        className="text-green-500 hover:text-green-400"
                      >
                        [✓]
                      </button>
                      <button 
                        onClick={() => editTask(task)}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        [E]
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        [X]
                      </button>
                    </div>
                  </div>
                  {task.expanded && (
                    <motion.div 
                      className="mt-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ul className="space-y-1 pl-4">
                        {task.subtasks.map(subtask => (
                          <li key={subtask.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() => toggleSubtask(task.id, subtask.id)}
                                className="mr-2"
                              />
                              <span className={`text-xs ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                                {subtask.text}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteSubtask(task.id, subtask.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              [X]
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex mt-2 gap-2">
                        <input
                          type="text"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          className="flex-grow bg-black border-b border-green-500 text-green-500 text-sm focus:outline-none"
                          placeholder="添加子任务..."
                        />
                        <button
                          onClick={() => addSubtask(task.id)}
                          className="px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black text-xs"
                        >
                          添加
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">[ 已完成任务 ]</h2>
            <AnimatePresence>
              {tasks.filter(task => task.status === 'done').map(task => (
                <motion.div 
                  key={task.id} 
                  className="mb-4 border border-green-500 p-2 opacity-60"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.6 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm line-through text-gray-500 flex items-center">
                      {getPrioritySymbol(task.priority)} {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      [X]
                    </button>
                  </div>
                  {task.subtasks.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-4">
                      {task.subtasks.map(subtask => (
                        <li key={subtask.id} className="flex items-center">
                          <span className="text-xs line-through text-gray-500">{subtask.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
