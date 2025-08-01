import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const CompanyInfo = ({ info, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', cnpj: '', address: '' });
  const { toast } = useToast();

  useEffect(() => {
    setFormData(info);
    if (!info.name && !info.cnpj && !info.address) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [info]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
    toast({
      title: "Sucesso!",
      description: "Informações da empresa salvas.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mei-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Dados da Empresa</h2>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa / Razão Social</Label>
              <Input
                id="company-name"
                placeholder="Ex: João da Silva MEI"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-cnpj">CNPJ</Label>
              <Input
                id="company-cnpj"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj || ''}
                onChange={(e) => handleChange('cnpj', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Endereço</Label>
            <Input
              id="company-address"
              placeholder="Ex: Rua das Flores, 123, São Paulo, SP"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" className="flex items-center gap-2 mei-button-primary">
              <Save className="w-4 h-4" />
              Salvar Informações
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nome da Empresa</p>
            <p className="font-medium text-gray-800">{info.name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CNPJ</p>
            <p className="font-medium text-gray-800">{info.cnpj || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Endereço</p>
            <p className="font-medium text-gray-800">{info.address || 'Não informado'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyInfo;