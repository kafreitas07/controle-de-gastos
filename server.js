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
app.listen(PORTA, () =>{
    console.log(`Servidor rodando na porta ${PORTA}`);

});
