import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Pedido } from '@/types/Pedido';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';

const PedidoList = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      const response = await api.get<Pedido[]>('/pedidos/');
      setPedidos(response.data);
    } catch (err) {
      setErro('Erro ao buscar pedidos.');
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const adicionarOuAtualizarPedido = async () => {
    if (!cliente || !valor || !descricao) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/pedidos/${editandoId}`, { cliente, valor: parseFloat(valor), descricao });
        setMensagem('Pedido atualizado com sucesso!');
      } else {
        const response = await api.post('/pedidos/', { cliente, valor: parseFloat(valor), descricao });
        setPedidos([...pedidos, response.data]);
        setMensagem('Pedido adicionado com sucesso!');
      }
      setCliente('');
      setValor('');
      setDescricao('');
      setEditandoId(null);
      setErro(null);
      fetchPedidos();
    } catch (err) {
      setErro('Erro ao adicionar ou atualizar pedido.');
    }
  };

  const excluirPedido = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await api.delete(`/pedidos/${id}`);
        setPedidos(pedidos.filter(pedido => pedido.id !== id));
        setMensagem('Pedido excluído com sucesso!');
      } catch (err) {
        setErro('Erro ao excluir pedido.');
      }
    }
  };

  const exportarCSV = () => {
    const csvContent = [
      ['ID', 'Cliente', 'Valor', 'Descrição'],
      ...pedidos.map(p => [p.id, p.cliente, p.valor.toFixed(2), p.descricao])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'pedidos.csv');
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.cliente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f8f8', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#ff3d00' }}>Sistema de Gestão de Pedidos</h1>

      {mensagem && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>{mensagem}</div>}
      {erro && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>{erro}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ flex: 2, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button onClick={adicionarOuAtualizarPedido} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#ff3d00', color: '#fff', border: 'none', cursor: 'pointer' }}>{editandoId ? 'Atualizar' : 'Adicionar'}</button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <input type="text" placeholder="Filtrar pedidos..." value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button onClick={exportarCSV} style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>Exportar CSV</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '5px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cliente</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Valor</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Descrição</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.cliente}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>R$ {pedido.valor.toFixed(2)}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{pedido.descricao}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', display: 'flex', gap: '5px' }}>
                <button onClick={() => { setCliente(pedido.cliente); setValor(pedido.valor.toString()); setDescricao(pedido.descricao); setEditandoId(pedido.id); }} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#FFC107', color: '#fff', border: 'none', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => excluirPedido(pedido.id)} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#DC3545', color: '#fff', border: 'none', cursor: 'pointer' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoList;
