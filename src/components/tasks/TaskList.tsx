// Capa de Presentación - Lista de tareas
import React from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, data: { title?: string; description?: string }) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 bg-muted rounded mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No tienes tareas pendientes
          </h3>
          <p className="text-sm text-muted-foreground">
            ¡Crea tu primera tarea para comenzar a organizarte!
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{pendingTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Completadas</span>
            </div>
            <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tareas pendientes */}
      {pendingTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Tareas Pendientes ({pendingTasks.length})
          </h3>
          {pendingTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Tareas completadas */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Tareas Completadas ({completedTasks.length})
          </h3>
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};