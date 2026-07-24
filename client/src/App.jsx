import { useState, useEffect } from 'react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId,setEditingId] = useState(null);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState([]);


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
  function startEdit(expense){
    setEditingId(expense.id);
    setDescription(expense.descricao);
    setAmount(expense.valor);
    setDate(expense.data);
    setCategoryId(expense.categoria_id);
  }

  // limpa todos os campos do formulário
  function cancelEdit(){
    setEditingId(null);
    setDescription('');
    setAmount('');
    setDate('');
    setCategoryId('');

}
// apaga um custo existente disparando para a API um delete
function deleteExpense(id){
  const confirmDelete = window.confirm('Excluir este gasto?');
  if(!confirmDelete) return;
  
  fetch(`/api/gastos/${id}`, {method:'DELETE'})
    .then(() => 
    {loadExpenses();
     loadSummary();}
);

}

  useEffect(() => {
    fetch('/api/categorias')
      .then(response => response.json())
      .then(data => setCategories(data));

    loadExpenses();
    loadSummary();

  }, []);

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

  request.then(() => {
    cancelEdit();
    loadExpenses();
    loadSummary();

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

          <button type='submit'>
            {editingId ? 'Salvar Edição' : 'Adicionar Gasto'}
          </button>
            {editingId && (
          <button type="button" onClick={cancelEdit}>
          Cancelar Edição
          </button>)}
      </form>
      <h2> Resumo</h2>
      <p>Total: R$ {total}</p>
      <ul>
        {byCategory.map(cat => (<li key ={cat.nome}>{cat.nome}: R$ {cat.total}
        </li>
        ))}
      </ul> 
      
      <h2>Gastos</h2>
        <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.descricao} - ${exp.valor} - {exp.categoria}
            <button onClick={() => startEdit(exp)}>editar</button>
            <button onClick={() => deleteExpense(exp.id)}>excluir</button>
          </li>
        ))}
      </ul>
    </div>  
  );
}

export default App;