const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));


// requisição para retornar todas as minhas categorias de gastos
app.get('/api/categorias', (req,res) =>{
    const categorias = db.prepare('SELECT id, nome, cor FROM categorias ORDER BY nome').all();
    res.json(categorias);
    
});


// requisição para inserir um novo gasto dentro do meu banco
app.post('/api/gastos', (req,res) => {
    const {descricao, valor, data, categoria_id} = req.body;
    if(!descricao || !valor || !data || !categoria_id)
        return res.status(400).json({ erro: 'Preencha todos os campos'});

    const inserir = db.prepare('INSERT INTO gastos (descricao, valor, data, categoria_id) VALUES (?, ?, ?, ?)');
    const resultado = inserir.run(descricao, valor, data, categoria_id);

    res.json ({id: resultado.lastInsertRowid});

});


// Requisição que retorna todos os meus gastos combinando as duas tabelas, gasto e categoria
app.get('/api/gastos', (req,res) => {
    const gastos = db.prepare(`
      SELECT gastos.id, 
      gastos.descricao, 
      gastos.valor, 
      gastos.data,  
      gastos.categoria_id,
      categorias.nome AS categoria, 
      categorias.cor
      FROM gastos 
      JOIN categorias ON categorias.id = gastos.categoria_id ORDER BY gastos.data DESC, gastos.id DESC`).all();
      res.json(gastos);

});

//requisição para deletar gastos pelo id 
app.delete('/api/gastos/:id', (req,res) =>{
    db.prepare('DELETE FROM gastos WHERE id = ?').run(req.params.id);
    res.status(204).send();
})



app.listen(PORTA, () =>{
    console.log(`Servidor rodando na porta ${PORTA}`);

});
