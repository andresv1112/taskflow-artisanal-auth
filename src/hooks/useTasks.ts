// Capa de Lógica - Hook personalizado para manejo de tareas
import { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';
import { TaskService } from '@/services/taskService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const taskService = new TaskService();

  // Cargar tareas del usuario
  const loadTasks = async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userTasks = await taskService.getUserTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Error al cargar las tareas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nueva tarea
  const createTask = async (taskData: CreateTaskData) => {
    if (!user) return;

    try {
      const result = await taskService.createTask(user.id, taskData);
      
      if (result.success && result.task) {
        setTasks(prev => [result.task!, ...prev]);
        toast({
          title: "Éxito",
          description: "Tarea creada correctamente"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al crear la tarea",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Error interno del servidor",
        variant: "destructive"
      });
      return false;
    }
  };

  // Actualizar tarea
  const updateTask = async (taskId: string, updateData: UpdateTaskData) => {
    if (!user) return;

    try {
      const result = await taskService.updateTask(taskId, user.id, updateData);
      
      if (result.success && result.task) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? result.task! : task
        ));
        toast({
          title: "Éxito",
          description: "Tarea actualizada correctamente"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al actualizar la tarea",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Error interno del servidor",
        variant: "destructive"
      });
      return false;
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const result = await taskService.deleteTask(taskId, user.id);
      
      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast({
          title: "Éxito",
          description: "Tarea eliminada correctamente"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al eliminar la tarea",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Error interno del servidor",
        variant: "destructive"
      });
      return false;
    }
  };

  // Cambiar estado de completado
  const toggleTaskCompletion = async (taskId: string) => {
    if (!user) return;

    try {
      const result = await taskService.toggleTaskCompletion(taskId, user.id);
      
      if (result.success && result.task) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? result.task! : task
        ));
        return true;
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al cambiar estado de la tarea",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Error interno del servidor",
        variant: "destructive"
      });
      return false;
    }
  };

  // Cargar tareas cuando el usuario cambie
  useEffect(() => {
    loadTasks();
  }, [user]);

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks: loadTasks
  };
};