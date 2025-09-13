// Capa de Datos - Repository para Tasks
import { supabase } from "@/integrations/supabase/client";
import { Task, CreateTaskData, UpdateTaskData } from "@/types/task";

export class TaskRepository {
  async findByUserId(userId: string): Promise<Task[]> {
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
      console.error('Error in findByUserId:', error);
      return [];
    }
  }

  async create(userId: string, taskData: CreateTaskData): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: taskData.title,
          description: taskData.description
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in create:', error);
      return null;
    }
  }

  async update(taskId: string, userId: string, updateData: UpdateTaskData): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in update:', error);
      return null;
    }
  }

  async delete(taskId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting task:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      return false;
    }
  }
}