# Controle de Gastos

Aplicação full stack para registrar, editar e visualizar gastos pessoais por categoria, com resumo agregado em tempo real.

## Funcionalidades

- Cadastro, edição e exclusão de gastos (CRUD completo)
- Filtro de gastos por categoria
- Resumo com total geral e total por categoria (agregação SQL)
- Interface visual com identidade própria (tema "recibo"), responsiva e com pequenas animações
- Tratamento de erros de rede/API, exibidos de forma visível ao usuário

## Tecnologias

**Front-end**
- React (Vite)
- CSS puro, com sistema de variáveis (design tokens) e animações

**Back-end**
- Node.js + Express
- SQLite via [`node:sqlite`](https://nodejs.org/api/sqlite.html) (módulo nativo do Node, ainda experimental)

## Arquitetura

```
Navegador (React)  --fetch()-->  API REST (Express)  --SQL-->  SQLite (gastos.db)
```

O front-end não acessa o banco diretamente — toda comunicação passa pela API REST, que executa as queries SQL.

## Estrutura do projeto

```
controle-gastos/
├── server.js           # servidor Express e rotas da API
├── database.js          # conexão com o SQLite, schema e seed
├── package.json
└── client/               # front-end (React + Vite)
    ├── package.json
    └── src/
        ├── App.jsx          # componente principal
        ├── App.css           # estilos do app
        ├── index.css          # variáveis globais e reset
        └── main.jsx            # ponto de entrada do React
```

## Modelo de dados

```sql
CREATE TABLE categorias (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL
);

CREATE TABLE gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao TEXT NOT NULL,
  valor REAL NOT NULL,
  data TEXT NOT NULL,
  categoria_id INTEGER NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

## Endpoints da API

| Método | Rota                        | Descrição                                          |
|--------|------------------------------|-----------------------------------------------------|
| GET    | `/api/categorias`             | Lista todas as categorias                           |
| GET    | `/api/gastos`                  | Lista gastos (com `JOIN` em categorias)             |
| GET    | `/api/gastos?categoria=ID`      | Filtra gastos por categoria                         |
| POST   | `/api/gastos`                    | Cria um novo gasto                                  |
| PUT    | `/api/gastos/:id`                  | Edita um gasto existente                            |
| DELETE | `/api/gastos/:id`                    | Exclui um gasto                                     |
| GET    | `/api/resumo`                          | Total geral e total por categoria (`GROUP BY`+`SUM`) |

## Como rodar o projeto

Pré-requisito: [Node.js](https://nodejs.org/) 22 ou superior (necessário para o `node:sqlite`).

**1. Back-end** (na raiz do projeto):
```bash
npm install
node server.js
```
Servidor sobe em `http://localhost:3000`.

**2. Front-end** (em outro terminal, dentro da pasta `client`):
```bash
cd client
npm install
npm run dev
```
Aplicação disponível em `http://localhost:5173`.

Os dois precisam estar rodando ao mesmo tempo — o Vite encaminha as chamadas de API (`/api/...`) para o servidor Express através de um proxy configurado em `client/vite.config.js`.

## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com apoio do **Claude (Anthropic)**, usado tanto como par de programação quanto como ferramenta de aprendizado ao longo de todo o processo.

O uso variou conforme a etapa:
- Em partes centrais para o aprendizado (lógica de rotas, queries SQL, estado em React), o Claude explicou o conceito e eu escrevi o código, com o Claude revisando e explicando os próprios erros que cometi no caminho.
- Em outras partes (como CSS, resolução de conflitos de merge e configuração de ambiente), o Claude gerou o código diretamente, que eu revisei, testei e ajustei antes de integrar ao projeto.

Em toda a jornada, validei o funcionamento de cada parte manualmente (testando no navegador, inspecionando erros no Console e na aba Network, conferindo dados diretamente no banco), e não integrei nenhum trecho sem entender o que ele fazia.

O Claude também foi usado para:
- Explicar conceitos de SQL, Node.js, Express e React conforme eu implementava cada parte
- Ajudar a debugar erros reais (de sintaxe, de configuração de ambiente, de lógica) através de leitura de logs, Console e aba Network do navegador
- Discutir decisões de arquitetura e trade-offs (ex: por que usar `node:sqlite` em vez de um pacote com dependência nativa


Consigo explicar e justificar qualquer trecho deste código.

## Próximos passos

- [ ] Deploy do back-end e front-end
- [ ] Testes automatizados
- [ ] Autenticação de usuário