// Capa de Lógica - Servicio de Tareas
import { supabase } from "@/integrations/supabase/client";
import { Task, CreateTaskData, UpdateTaskData } from "@/types/task";

export class TaskService {
  constructor() {
    // No dependencies needed, direct access to data layer
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error finding tasks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserTasks:', error);
      return [];
    }
  }

  async createTask(userId: string, taskData: CreateTaskData): Promise<{ success: boolean; task?: Task; error?: string }> {
    try {
      // Validaciones
      if (!taskData.title || taskData.title.trim().length === 0) {
        return {
          success: false,
          error: "El título de la tarea es requerido"
        };
      }

      if (taskData.title.length > 100) {
        return {
          success: false,
          error: "El título no puede tener más de 100 caracteres"
        };
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: taskData.title.trim(),
          description: taskData.description?.trim()
        })
        .select()
        .single();

      if (error || !task) {
        return {
          success: false,
          error: "Error al crear la tarea"
        };
      }

      return {
        success: true,
        task
      };
    } catch (error) {
      console.error('Error in createTask:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }

  async updateTask(taskId: string, userId: string, updateData: UpdateTaskData): Promise<{ success: boolean; task?: Task; error?: string }> {
    try {
      // Validaciones
      if (updateData.title !== undefined && updateData.title.trim().length === 0) {
        return {
          success: false,
          error: "El título de la tarea no puede estar vacío"
        };
      }

      if (updateData.title && updateData.title.length > 100) {
        return {
          success: false,
          error: "El título no puede tener más de 100 caracteres"
        };
      }

      const cleanUpdateData: UpdateTaskData = {};
      if (updateData.title !== undefined) {
        cleanUpdateData.title = updateData.title.trim();
      }
      if (updateData.description !== undefined) {
        cleanUpdateData.description = updateData.description?.trim();
      }
      if (updateData.completed !== undefined) {
        cleanUpdateData.completed = updateData.completed;
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .update(cleanUpdateData)
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !task) {
        return {
          success: false,
          error: "Error al actualizar la tarea"
        };
      }

      return {
        success: true,
        task
      };
    } catch (error) {
      console.error('Error in updateTask:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          error: "Error al eliminar la tarea"
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error in deleteTask:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }

  async toggleTaskCompletion(taskId: string, userId: string): Promise<{ success: boolean; task?: Task; error?: string }> {
    try {
      // Primero obtenemos la tarea específica
      const { data: currentTask, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();

      if (error || !currentTask) {
        return {
          success: false,
          error: "Tarea no encontrada"
        };
      }

      return await this.updateTask(taskId, userId, {
        completed: !currentTask.completed
      });
    } catch (error) {
      console.error('Error in toggleTaskCompletion:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }
}