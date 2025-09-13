// Capa de Presentación - Formulario para crear tareas
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateTaskFormProps {
  onCreateTask: (data: { title: string; description?: string }) => Promise<boolean>;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);
    
    const success = await onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined
    });

    if (success) {
      setTitle('');
      setDescription('');
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nueva Tarea
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="¿Qué necesitas hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              maxLength={100}
              required
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/100 caracteres
            </p>
          </div>
          
          <Textarea
            placeholder="Descripción adicional (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? "Creando..." : "Crear Tarea"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Presiona Ctrl + Enter para crear rápidamente
        </p>
      </CardContent>
    </Card>
  );
};