"use client"

import { useState, useEffect } from 'react'
import { PlusCircle, CheckCircle, Circle, Trash, Edit2, ChevronDown, ChevronRight, Zap, Database, Cpu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function TechPixelTodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newSubtask, setNewSubtask] = useState('')

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
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
      setTasks(prevTasks => [...prevTasks, newTaskItem])
      setNewTask('')
      setNewTaskPriority('medium')
    }
  }

  const addSubtask = (taskId: number) => {
    if (newSubtask.trim()) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), text: newSubtask, completed: false }] }
            : task
        )
      )
      setNewSubtask('')
    }
  }

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
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
    )
  }

  const deleteSubtask = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId) }
          : task
      )
    )
  }

  const completeTask = (task: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === task.id ? { ...t, status: 'done', subtasks: t.subtasks.map(st => ({ ...st, completed: true })) } : t
      )
    )
  }

  const deleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
  }

  const updateTask = (id: number, newText: string, newPriority: Priority) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text: newText, priority: newPriority } : task
      )
    )
    setEditingTask(null)
  }

  const toggleExpanded = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    )
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-gray-800 text-white border-l-4 border-l-red-500'
      case 'medium':
        return 'bg-gray-800 text-white border-l-4 border-l-yellow-500'
      case 'low':
        return 'bg-gray-800 text-white border-l-4 border-l-green-500'
      default:
        return 'bg-gray-900 text-gray-100'
    }
  }

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <Zap className="w-4 h-4 mr-1" />
      case 'medium':
        return <Database className="w-4 h-4 mr-1" />
      case 'low':
        return <Cpu className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold mb-6 text-center text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          科技像素风 TODO LIST <Cpu className="inline-block ml-2" />
        </motion.h1>
        
        <motion.div 
          className="flex mb-6 gap-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow bg-gray-900 border-gray-700 text-white text-sm"
            placeholder="添加新任务..."
          />
          <Select value={newTaskPriority} onValueChange={(value: Priority) => setNewTaskPriority(value)}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="选择优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTask} className="bg-white hover:bg-gray-200 text-black">
            <PlusCircle className="mr-2" size={16} /> 添加
          </Button>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-white">任务列表</h2>
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <h3 className="text-lg font-medium mb-2 text-white">待完成</h3>
              <AnimatePresence>
                {tasks.filter(task => task.status === 'todo').map(task => (
                  <motion.div 
                    key={task.id} 
                    className={`p-3 rounded mb-2 ${getPriorityColor(task.priority)} border border-gray-700`}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {editingTask && editingTask.id === task.id ? (
                        <div className="flex items-center gap-2 flex-grow">
                          <Input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                            className="flex-grow bg-gray-900 border-gray-700 text-white text-sm"
                            autoFocus
                          />
                          <Select 
                            value={editingTask.priority} 
                            onValueChange={(value: Priority) => setEditingTask({...editingTask, priority: value})}
                          >
                            <SelectTrigger className="w-[100px] bg-gray-900 border-gray-700 text-white">
                              <SelectValue placeholder="优先级" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">低</SelectItem>
                              <SelectItem value="medium">中</SelectItem>
                              <SelectItem value="high">高</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            onClick={() => updateTask(task.id, editingTask.text, editingTask.priority)}
                            variant="secondary"
                            size="sm"
                            className="bg-white hover:bg-gray-200 text-black"
                          >
                            保存
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm flex items-center">
                          {getPriorityIcon(task.priority)}
                          {task.text}
                        </span>
                      )}
                      <div className="flex items-center">
                        <Button 
                          onClick={() => toggleExpanded(task.id)} 
                          variant="ghost"
                          size="sm"
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800"
                        >
                          {task.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </Button>
                        <Button 
                          onClick={() => completeTask(task)} 
                          variant="ghost"
                          size="sm"
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800"
                        >
                          <CheckCircle size={16} />
                        </Button>
                        <Button 
                          onClick={() => editTask(task)} 
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-800"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          onClick={() => deleteTask(task.id)} 
                          variant="ghost"
                          size="sm"
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-800"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    {task.expanded && (
                      <motion.div 
                        className="mt-2"
                        initial={{ height: 0, opacity: 0  }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-1">
                          {task.subtasks.map(subtask => (
                            <li key={subtask.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                  onChange={() => toggleSubtask(task.id, subtask.id)}
                                  className="mr-2 rounded bg-slate-700 border-gray-700 text-white"
                                />
                                <span className={`text-xs ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                                  {subtask.text}
                                </span>
                              </div>
                              <Button
                                onClick={() => deleteSubtask(task.id, subtask.id)}
                                variant="ghost"
                                size="sm"
                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-800"
                              >
                                <Trash size={12} />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex mt-2 gap-2">
                          <Input
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            className="flex-grow bg-gray-800 border-gray-700 text-white text-xs"
                            placeholder="添加子任务..."
                          />
                          <Button
                            onClick={() => addSubtask(task.id)}
                            variant="secondary"
                            size="sm"
                            className="bg-white hover:bg-gray-200 text-black text-xs"
                          >
                            添加
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">已完成</h2>
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <AnimatePresence>
                {tasks.filter(task => task.status === 'done').map(task => (
                  <motion.div 
                    key={task.id} 
                    className={`p-3 rounded mb-2 ${getPriorityColor(task.priority)} opacity-60 border border-gray-700`}
                    initial={{ x: 50, opacity: 0 }}
                    
                    animate={{ x: 0, opacity: 0.6 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm line-through text-gray-500 flex items-center">
                        {getPriorityIcon(task.priority)}
                        {task.text}
                      </span>
                      <Button 
                        onClick={() => deleteTask(task.id)} 
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-800"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                    {task.subtasks.length > 0 && (
                      <ul className="mt-2 space-y-1">
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
    </div>
  )
}