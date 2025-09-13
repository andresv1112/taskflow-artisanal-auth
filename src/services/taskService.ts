// Capa de Lógica - Servicio de Tareas
import { TaskRepository } from "@/data/repositories/taskRepository";
import { Task, CreateTaskData, UpdateTaskData } from "@/types/task";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      return await this.taskRepository.findByUserId(userId);
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

      const task = await this.taskRepository.create(userId, {
        title: taskData.title.trim(),
        description: taskData.description?.trim()
      });

      if (!task) {
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

      const task = await this.taskRepository.update(taskId, userId, cleanUpdateData);

      if (!task) {
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
      const success = await this.taskRepository.delete(taskId, userId);

      if (!success) {
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
      // Primero obtenemos las tareas del usuario para encontrar la tarea específica
      const tasks = await this.taskRepository.findByUserId(userId);
      const currentTask = tasks.find(task => task.id === taskId);

      if (!currentTask) {
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