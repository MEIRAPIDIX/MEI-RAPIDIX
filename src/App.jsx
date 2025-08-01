import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, TrendingDown, Calculator, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import TransactionList from '@/components/TransactionList';
import CompanyInfo from '@/components/CompanyInfo';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dasPaid, setDasPaid] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({ name: '', cnpj: '', address: '' });

  // Carregar dados do localStorage
  useEffect(() => {
    const savedIncomes = localStorage.getItem('mei-incomes');
    const savedExpenses = localStorage.getItem('mei-expenses');
    const savedDas = localStorage.getItem('mei-das-paid');
    const savedCompanyInfo = localStorage.getItem('mei-company-info');

    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedDas) setDasPaid(parseFloat(savedDas));
    if (savedCompanyInfo) setCompanyInfo(JSON.parse(savedCompanyInfo));
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('mei-incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('mei-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('mei-das-paid', dasPaid.toString());
  }, [dasPaid]);

  useEffect(() => {
    localStorage.setItem('mei-company-info', JSON.stringify(companyInfo));
  }, [companyInfo]);

  const getCurrentMonth = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCurrentMonthTransactions = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date + 'T00:00:00');
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  };

  const currentMonthIncomes = getCurrentMonthTransactions(incomes);
  const currentMonthExpenses = getCurrentMonthTransactions(expenses);

  const totalIncome = currentMonthIncomes.reduce((sum, income) => sum + income.value, 0);
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.value, 0);
  const profit = totalIncome - totalExpenses - dasPaid;

  const addIncome = (income) => setIncomes(prev => [...prev, income]);
  const addExpense = (expense) => setExpenses(prev => [...prev, expense]);
  const editIncome = (updatedIncome) => setIncomes(prev => prev.map(i => i.id === updatedIncome.id ? updatedIncome : i));
  const editExpense = (updatedExpense) => setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  const deleteIncome = (id) => setIncomes(prev => prev.filter(i => i.id !== id));
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));
  const saveCompanyInfo = (info) => setCompanyInfo(info);

  const openDasLink = () => {
    window.open('https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/dasnsimei.app/Identificacao', '_blank');
  };

  const openDeclarationLink = () => {
    window.open('https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/dasnsimei.app/Identificacao', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>MEI-RAPIDIX - Gestão Financeira para MEI</title>
        <meta name="description" content="Sistema completo de gestão financeira para Microempreendedores Individuais. Controle receitas, despesas e gere DAS mensal facilmente." />
      </Helmet>

      <div className="min-h-screen mei-gradient">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Cabeçalho */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <img src="https://horizons-cdn.hostinger.com/cd522862-0a50-4396-b430-203916e2e3c2/ba7e2feb5eafbeb4b392cffdc002a65e.jpg" alt="Logo MEI-RAPIDIX" className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MEI-RAPIDIX</h1>
            <p className="text-xl text-gray-600 mb-6">{getCurrentMonth()}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button onClick={openDasLink} className="mei-button-primary text-lg py-4 px-8 flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                GERAR DAS MENSAL
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button onClick={openDeclarationLink} variant="outline" className="text-lg py-4 px-8 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                <FileText className="w-5 h-5" />
                GERAR DECLARAÇÃO ANUAL
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.header>

          <main className="grid gap-8">
            {/* Seção de Informações da Empresa */}
            <CompanyInfo info={companyInfo} onSave={saveCompanyInfo} />
            
            {/* Seção Entradas */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mei-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Entradas</h2>
                </div>
                <AddTransactionDialog type="income" onAdd={addIncome} />
              </div>
              <TransactionList transactions={currentMonthIncomes} type="income" onEdit={editIncome} onDelete={deleteIncome} />
            </motion.section>

            {/* Seção Saídas */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mei-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Saídas</h2>
                </div>
                <AddTransactionDialog type="expense" onAdd={addExpense} />
              </div>
              <TransactionList transactions={currentMonthExpenses} type="expense" onEdit={editExpense} onDelete={deleteExpense} />
            </motion.section>

            {/* Resumo Financeiro */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mei-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-blue-600" />
                Resumo Financeiro do Mês
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">Despesas Totais</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">DAS Pago</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={dasPaid || ''}
                      onChange={(e) => setDasPaid(parseFloat(e.target.value) || 0)}
                      className="text-xl font-bold text-blue-600 bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600 mb-1">
                    {profit >= 0 ? 'Lucro' : 'Prejuízo'}
                  </p>
                  <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(profit))}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Cálculo:</strong> Receitas ({formatCurrency(totalIncome)}) - Despesas ({formatCurrency(totalExpenses)}) - DAS ({formatCurrency(dasPaid)}) = {formatCurrency(profit)}
                </p>
              </div>
            </motion.section>
          </main>
        </div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;