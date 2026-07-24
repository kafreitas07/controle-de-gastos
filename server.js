const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.get('/api/categorias', (req,res) =>{
    const categorias = db.prepare('SELECT id, nome, cor FROM categorias ORDER BY nome').all();
    res.json(categorias);
    
});

app.post('/api/gastos', (req,res) => {
    const {descricao, valor, data, categoria_id} = req.body;
    if(!descricao || !valor || !data || !categoria_id)
        return res.status(400).json({ erro: 'Preencha todos os campos'});

    const inserir = db.prepare('INSERT INTO gastos (descricao, valor, data, categoria_id) VALUES (?, ?, ?, ?)');
    const resultado = inserir.run(descricao, valor, data, categoria_id);

    res.json ({id: resultado.lastInsertRowid});

});


app.listen(PORTA, () =>{
    console.log(`Servidor rodando na porta ${PORTA}`);

});
