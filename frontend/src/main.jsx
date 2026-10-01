import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TasksList from '../components/TasksList.tsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TasksList />
  </StrictMode>
)
