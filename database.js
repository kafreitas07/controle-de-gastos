const {DatabaseSync} = require('node:sqlite');
const path = require ('path');

const db = new DatabaseSync(path.join(__dirname, 'gastos.db'),{enableForeignKeyConstraints: true, });


db.exec(`
    CREATE TABLE IF NOT EXISTS categorias(
    id INTEGER PRIMARY KEY,
    nome TEXT NOT null,
    cor TEXT NOT NULL);

    CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao NOT NULL,
    valor REAL NOT NULL,
    data TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
`);
const { total} = db.prepare('SELECT COUNT(*) AS total FROM categorias').get();


if (total === 0){
    const categoriaspadrao = [
    [1, 'Alimentação', '#B5533C'],
    [2, 'Transporte', '#3B6E8F'],
    [3, 'Lazer', '#8A5FA0'],
    [4, 'Saúde', '#C79A3B'],
    [5, 'Outros', '#6B6560']
    ];

    const inserir = db.prepare ('INSERT INTO categorias (id, nome, cor)VALUES ( ?, ?, ?)' );
    for(const linha of categoriaspadrao){
inserir.run(...linha);
    }
}
module.exports = db;
