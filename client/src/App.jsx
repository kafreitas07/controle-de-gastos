import { useState, useEffect } from 'react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  function loadExpenses() {
    fetch('/api/gastos')
      .then(response => response.json())
      .then(data => setExpenses(data));
  }

  useEffect(() => {
    fetch('/api/categorias')
      .then(response => response.json())
      .then(data => setCategories(data));

    loadExpenses();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const newExpense = {
      descricao: description,
      valor: parseFloat(amount),
      data: date,
      categoria_id: Number(categoryId),
    };

    fetch('/api/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense),
    }).then(() => {
      setDescription('');
      setAmount('');
      setDate('');
      setCategoryId('');
      loadExpenses();
    });
  }

  return (
    <div>
      <h1>Controle de Gastos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descrição</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

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
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Categoria</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <button type="submit">Adicionar Gasto</button>
      </form>

      <h2>Gastos</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.descricao} - ${exp.valor} - {exp.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;