
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AddTransactionDialog = ({ type, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    value: '',
    category: type === 'expense' ? 'Geral' : ''
  });
  const { toast } = useToast();

  const expenseCategories = [
    'Geral',
    'Material de Escritório',
    'Combustível',
    'Alimentação',
    'Telefone/Internet',
    'Marketing',
    'Equipamentos',
    'Outros'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.value) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const transaction = {
      id: Date.now(),
      date: formData.date,
      description: formData.description.trim(),
      value: parseFloat(formData.value),
      category: formData.category || 'Geral'
    };

    onAdd(transaction);
    
    toast({
      title: "Sucesso!",
      description: `${type === 'income' ? 'Receita' : 'Despesa'} adicionada com sucesso.`
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      value: '',
      category: type === 'expense' ? 'Geral' : ''
    });
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mei-button-secondary">
          <Plus className="w-4 h-4 mr-2" />
          {type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'income' ? 'Nova Receita' : 'Nova Despesa'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Venda de produto, Compra de material..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          {type === 'expense' && (
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="mei-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="mei-button-primary">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
