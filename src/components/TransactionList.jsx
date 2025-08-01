
import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const TransactionList = ({ transactions, type, onEdit, onDelete }) => {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({});
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      date: transaction.date,
      description: transaction.description,
      value: transaction.value.toString(),
      category: transaction.category || 'Geral'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    if (!editFormData.description.trim() || !editFormData.value) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedTransaction = {
      ...editingTransaction,
      date: editFormData.date,
      description: editFormData.description.trim(),
      value: parseFloat(editFormData.value),
      category: editFormData.category || 'Geral'
    };

    onEdit(updatedTransaction);
    
    toast({
      title: "Sucesso!",
      description: `${type === 'income' ? 'Receita' : 'Despesa'} atualizada com sucesso.`
    });

    setEditingTransaction(null);
    setEditFormData({});
  };

  const handleDelete = (transaction) => {
    if (window.confirm(`Tem certeza que deseja excluir esta ${type === 'income' ? 'receita' : 'despesa'}?`)) {
      onDelete(transaction.id);
      toast({
        title: "Sucesso!",
        description: `${type === 'income' ? 'Receita' : 'Despesa'} excluída com sucesso.`
      });
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma {type === 'income' ? 'receita' : 'despesa'} cadastrada ainda.</p>
        <p className="text-sm mt-1">Clique no botão acima para adicionar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{transaction.description}</span>
                <span className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(transaction.value)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{formatDate(transaction.date)}</span>
                {type === 'expense' && transaction.category && (
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {transaction.category}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(transaction)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(transaction)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Editar {type === 'income' ? 'Receita' : 'Despesa'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editFormData.date || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                placeholder="Ex: Venda de produto, Compra de material..."
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            {type === 'expense' && (
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <select
                  id="edit-category"
                  className="mei-select"
                  value={editFormData.category || 'Geral'}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="edit-value">Valor (R$)</Label>
              <Input
                id="edit-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={editFormData.value || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, value: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingTransaction(null)}>
                Cancelar
              </Button>
              <Button type="submit" className="mei-button-primary">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
