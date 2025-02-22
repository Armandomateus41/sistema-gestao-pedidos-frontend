import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Pedido } from '@/types/Pedido';

const PedidoList = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

  const adicionarOuEditarPedido = async () => {
    if (!cliente || !valor || !descricao) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/pedidos/${editandoId}`, { cliente, valor: parseFloat(valor), descricao });
        setPedidos(pedidos.map(p => (p.id === editandoId ? { ...p, cliente, valor: parseFloat(valor), descricao } : p)));
        setMensagem('Pedido atualizado com sucesso!');
      } else {
        const response = await api.post('/pedidos/', { cliente, valor: parseFloat(valor), descricao });
        setPedidos([...pedidos, response.data]);
        setMensagem('Pedido adicionado com sucesso!');
      }
      resetarFormulario();
    } catch (err) {
      setErro('Erro ao adicionar ou editar pedido.');
    }
  };

  const excluirPedido = async (id: string) => {
    try {
      await api.delete(`/pedidos/${id}`);
      setPedidos(pedidos.filter(pedido => pedido.id !== id));
      setMensagem('Pedido excluído com sucesso!');
    } catch (err) {
      setErro('Erro ao excluir pedido.');
    }
  };

  const editarPedido = (pedido: Pedido) => {
    setCliente(pedido.cliente);
    setValor(pedido.valor.toString());
    setDescricao(pedido.descricao);
    setEditandoId(pedido.id);
  };

  const resetarFormulario = () => {
    setCliente('');
    setValor('');
    setDescricao('');
    setEditandoId(null);
    setErro(null);
  };

  const exportarCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + ['ID,Cliente,Valor,Descrição'].join(',') + '\n'
      + pedidos.map(p => `${p.id},${p.cliente},${p.valor},${p.descricao}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pedidos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
    pedido.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#e32227' }}>Sistema de Gestão de Pedidos</h1>

        {mensagem && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>{mensagem}</div>}
        {erro && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>{erro}</div>}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input type="text" placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ flex: '2', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button onClick={adicionarOuEditarPedido} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#e32227', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {editandoId ? 'Atualizar Pedido' : 'Adicionar Pedido'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <input type="text" placeholder="Filtrar pedidos..." value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: '1' }} />
          <button onClick={exportarCSV} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Exportar CSV</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#e32227', color: '#000' }}>
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
                  <button onClick={() => editarPedido(pedido)} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#ffc107', color: '#fff', border: 'none', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => excluirPedido(pedido.id)} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidoList;
