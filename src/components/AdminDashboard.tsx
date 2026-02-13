import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  description: string;
  created_at: string;
}

interface FixedCost {
  id: string;
  month: number;
  year: number;
  payroll: number;
  rent: number;
  evn: number;
  other_costs: number;
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'invoices' | 'costs'>('invoices');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [newItem, setNewItem] = useState<any>(null);

  // ===== QUERIES =====
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: fixedCosts = [], isLoading: costsLoading } = useQuery({
    queryKey: ['fixedCosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_costs')
        .select('*')
        .order('year', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // ===== MUTATIONS =====
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoice: any) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoice]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setNewItem(null);
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoice: any) => {
      const { error } = await supabase
        .from('invoices')
        .update(invoice)
        .eq('id', invoice.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditingId(null);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const createCostMutation = useMutation({
    mutationFn: async (cost: any) => {
      const { data, error } = await supabase
        .from('fixed_costs')
        .insert([cost]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setNewItem(null);
    },
  });

  const updateCostMutation = useMutation({
    mutationFn: async (cost: any) => {
      const { error } = await supabase
        .from('fixed_costs')
        .update(cost)
        .eq('id', cost.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditingId(null);
    },
  });

  const deleteCostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fixed_costs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  // ===== STYLES =====
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(15, 23, 42), rgb(49, 46, 129))',
    padding: '2rem 1.5rem'
  };

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '1rem',
    padding: '1.5rem'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'rgb(59, 130, 246)',
    color: 'white'
  };

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'rgb(239, 68, 68)',
    color: 'white'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem' }}>🔧 Panel de Administración</h1>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              ...primaryButtonStyle,
              background: activeTab === 'invoices' ? 'rgb(59, 130, 246)' : 'rgba(59, 130, 246, 0.3)'
            }}
          >
            💰 Facturas
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            style={{
              ...primaryButtonStyle,
              background: activeTab === 'costs' ? 'rgb(59, 130, 246)' : 'rgba(59, 130, 246, 0.3)'
            }}
          >
            📊 Costos Fijos
          </button>
        </div>

        {/* FACTURAS */}
        {activeTab === 'invoices' && (
          <div>
            <button
              onClick={() => setNewItem({})}
              style={{ ...primaryButtonStyle, marginBottom: '2rem' }}
            >
              <Plus style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
              Nueva Factura
            </button>

            {newItem && activeTab === 'invoices' && (
              <div style={{ ...cardStyle, marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>➕ Nueva Factura</h3>
                <input
                  type="text"
                  placeholder="Número de factura"
                  value={formData.invoice_number || ''}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Monto"
                  value={formData.total_amount || ''}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Descripción"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: '5rem', resize: 'none' } as any}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      createInvoiceMutation.mutate({
                        invoice_number: formData.invoice_number,
                        total_amount: formData.total_amount,
                        description: formData.description,
                        created_at: new Date().toISOString()
                      });
                    }}
                    style={primaryButtonStyle}
                  >
                    <Save style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
                    Guardar
                  </button>
                  <button
                    onClick={() => { setNewItem(null); setFormData({}); }}
                    style={dangerButtonStyle}
                  >
                    <X style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              {invoices.map((invoice: Invoice) => (
                <div key={invoice.id} style={{ ...cardStyle, border: '2px solid rgba(34, 197, 94, 0.2)' }}>
                  {editingId === invoice.id ? (
                    <div>
                      <input
                        type="text"
                        value={formData.invoice_number || invoice.invoice_number}
                        onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        value={formData.total_amount || invoice.total_amount}
                        onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                      <textarea
                        value={formData.description || invoice.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ ...inputStyle, minHeight: '5rem', resize: 'none' } as any}
                      />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => updateInvoiceMutation.mutate({ id: invoice.id, ...formData })}
                          style={primaryButtonStyle}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setFormData({}); }}
                          style={dangerButtonStyle}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ color: 'rgb(134, 239, 172)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {invoice.invoice_number}
                          </p>
                          <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            ${Number(invoice.total_amount).toFixed(2)}
                          </p>
                          <p style={{ color: 'rgb(148, 163, 184)', fontSize: '0.875rem' }}>
                            {invoice.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => { setEditingId(invoice.id); setFormData(invoice); }}
                            style={{ ...buttonStyle, background: 'rgb(59, 130, 246)', color: 'white' }}
                          >
                            <Edit2 width={16} height={16} />
                          </button>
                          <button
                            onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                            style={{ ...buttonStyle, background: 'rgb(239, 68, 68)', color: 'white' }}
                          >
                            <Trash2 width={16} height={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COSTOS FIJOS */}
        {activeTab === 'costs' && (
          <div>
            <button
              onClick={() => setNewItem({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })}
              style={{ ...primaryButtonStyle, marginBottom: '2rem' }}
            >
              <Plus style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
              Nuevo Costo
            </button>

            {newItem && activeTab === 'costs' && (
              <div style={{ ...cardStyle, marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>➕ Nuevo Costo Fijo</h3>
                <select
                  value={formData.month || 2}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  style={inputStyle}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>Mes {m}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Año"
                  value={formData.year || 2026}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Nómina"
                  value={formData.payroll || ''}
                  onChange={(e) => setFormData({ ...formData, payroll: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Alquiler"
                  value={formData.rent || ''}
                  onChange={(e) => setFormData({ ...formData, rent: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Energía/Utilidades"
                  value={formData.evn || ''}
                  onChange={(e) => setFormData({ ...formData, evn: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Otros costos"
                  value={formData.other_costs || ''}
                  onChange={(e) => setFormData({ ...formData, other_costs: parseFloat(e.target.value) })}
                  style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      createCostMutation.mutate(formData);
                    }}
                    style={primaryButtonStyle}
                  >
                    <Save style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
                    Guardar
                  </button>
                  <button
                    onClick={() => { setNewItem(null); setFormData({}); }}
                    style={dangerButtonStyle}
                  >
                    <X style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              {fixedCosts.map((cost: FixedCost) => (
                <div key={cost.id} style={{ ...cardStyle, border: '2px solid rgba(239, 68, 68, 0.2)' }}>
                  {editingId === cost.id ? (
                    <div>
                      <input
                        type="number"
                        placeholder="Nómina"
                        value={formData.payroll || cost.payroll}
                        onChange={(e) => setFormData({ ...formData, payroll: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="Alquiler"
                        value={formData.rent || cost.rent}
                        onChange={(e) => setFormData({ ...formData, rent: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="Energía/Utilidades"
                        value={formData.evn || cost.evn}
                        onChange={(e) => setFormData({ ...formData, evn: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="Otros costos"
                        value={formData.other_costs || cost.other_costs}
                        onChange={(e) => setFormData({ ...formData, other_costs: parseFloat(e.target.value) })}
                        style={inputStyle}
                      />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => updateCostMutation.mutate({ id: cost.id, ...formData })}
                          style={primaryButtonStyle}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setFormData({}); }}
                          style={dangerButtonStyle}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <p style={{ color: 'rgb(252, 165, 165)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            Mes {cost.month} / {cost.year}
                          </p>
                          <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            ${Number(cost.payroll + cost.rent + cost.evn + cost.other_costs).toFixed(2)}
                          </p>
                          <p style={{ color: 'rgb(148, 163, 184)', fontSize: '0.875rem' }}>
                            Nómina: ${cost.payroll} | Alquiler: ${cost.rent} | Energía: ${cost.evn} | Otros: ${cost.other_costs}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => { setEditingId(cost.id); setFormData(cost); }}
                            style={{ ...buttonStyle, background: 'rgb(59, 130, 246)', color: 'white' }}
                          >
                            <Edit2 width={16} height={16} />
                          </button>
                          <button
                            onClick={() => deleteCostMutation.mutate(cost.id)}
                            style={{ ...buttonStyle, background: 'rgb(239, 68, 68)', color: 'white' }}
                          >
                            <Trash2 width={16} height={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
