import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState([]);
  const [error, setError] = useState(null);


  function loadExpenses() {
    fetch('/api/gastos')
      .then(response => response.json())
      .then(data => setExpenses(data));
  }

  function loadSummary() {
    fetch('/api/resumo')
      .then(response => response.json())
      .then(data => {
        setTotal(data.total);
        setByCategory(data.byCategory);
      });
  }

  // recebe o gasto inteiro, inserindo os dados preenchidos em seus determinados campos
  function startEdit(expense) {
    setEditingId(expense.id);
    setDescription(expense.descricao);
    setAmount(expense.valor);
    setDate(expense.data);
    setCategoryId(expense.categoria_id);
  }

  // limpa todos os campos do formulário
  function cancelEdit() {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setDate('');
    setCategoryId('');
  }

  // apaga um custo existente disparando para a API um delete
 function deleteExpense(id) {
  const confirmDelete = window.confirm('Excluir este gasto?');
  if (!confirmDelete) return;

  fetch(`/api/gastos/${id}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível excluir o gasto.');
      }
      loadExpenses();
      loadSummary();
      setError(null);
    })
    .catch(err => {
      setError(err.message);
    });
}

  useEffect(() => {
    fetch('/api/categorias')
      .then(response => response.json())
      .then(data => setCategories(data));

    loadExpenses();
    loadSummary();
  }, []);

  useEffect(() => {
    const start = displayedTotal;
    const end = total;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayedTotal(start + (end - start) * progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [total]);

  function handleSubmit(event) {
    event.preventDefault();

    const expenseData = {
      descricao: description,
      valor: parseFloat(amount),
      data: date,
      categoria_id: Number(categoryId),
    };

    const request = editingId
      ? fetch(`/api/gastos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        })
      : fetch('/api/gastos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });

    request
  .then(response => {
    if (!response.ok) {
      throw new Error('Não foi possível salvar o gasto.');
    }
    cancelEdit();
    loadExpenses();
    loadSummary();
    setError(null);
  })
  .catch(err => {
    setError(err.message);
  });
  }

  return (
    <div className="receipt">
      <div className="receipt__perforation" />

      <header className="receipt__header">
        <p className="receipt__eyebrow">extrato pessoal</p>
        <h1 className="receipt__title">Controle de Gastos</h1>
      </header>

      <hr className="divider" />

      <section className="summary">
        <div className="summary__total">
          <span>Total</span>
          <span className="summary__total-value">R$ {displayedTotal.toFixed(2)}</span>
        </div>

        <ul className="summary__categories">
          {byCategory.map(cat => (
            <li key={cat.nome}>
              <div className="summary__row">
                <span>{cat.nome}</span>
                <span>R$ {cat.total.toFixed(2)}</span>
              </div>
              <div className="summary__bar-track">
                <div
                  className="summary__bar-fill"
                  style={{
                    width: `${(cat.total / byCategory[0].total) * 100}%`,
                    background: cat.cor,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <hr className="divider" />
      {error && (
        <p className="error-message">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="form-section">
        <h2 className="section-title">Novo lançamento</h2>

        <div className="form-row">
          <label>Descrição</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-row form-row--double">
          <div>
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Data</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <label>Categoria</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Salvar Edição' : 'Adicionar Gasto'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--text" onClick={cancelEdit}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <hr className="divider" />

      <section className="list-section">
        <h2 className="section-title">Lançamentos</h2>

        {expenses.length === 0 ? (
          <p className="empty-state">Nenhum gasto lançado ainda.</p>
        ) : (
          <ul>
            {expenses.map(exp => (
              <li key={exp.id} className="expense-item">
                <span
                  className="expense-item__tag"
                  style={{ background: exp.cor }}
                >
                  {exp.categoria}
                </span>
                <span className="expense-item__desc">{exp.descricao}</span>
                <span className="expense-item__leader" />
                <span className="expense-item__amount">R$ {exp.valor.toFixed(2)}</span>
                <span className="expense-item__actions">
                  <button className="link-btn" onClick={() => startEdit(exp)}>editar</button>
                  <button className="link-btn" onClick={() => deleteExpense(exp.id)}>excluir</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="receipt__perforation" />
    </div>
  );
}

export default App;