// Capa de Presentación - Dashboard principal
import React from 'react';
import { Header } from '@/components/layout/Header';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';

const DashboardPage: React.FC = () => {
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Formulario para crear tareas */}
          <CreateTaskForm onCreateTask={createTask} />
          
          {/* Lista de tareas */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggleComplete={toggleTaskCompletion}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;