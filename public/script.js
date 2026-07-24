const formGasto = document.getElementById('formGasto');
const campoDescricao = document.getElementById('descricao');
const campoValor = document.getElementById('valor');
const campoData = document.getElementById('data');
const campoCategoria = document.getElementById('categoria');
const listaGastoEl = document.getElementById('listaGastos');


async function carregarCategorias(){
    const resposta = await fetch('/api/categorias');
    const categorias = await resposta.json();

    campoCategoria.innerHTML = categorias.map(cat => `{<option value="${cat.id}">${cat.nome}</option>`).join('');
}

async function carregarGastos() {
    const resposta = await fetch('/api/gastos');
    const gastos = await resposta.json();

    listaGastoEl.innerHTML = gastos.map(g => `<li>${g.descricao} - R$ ${g.valor} - ${g.categoria}</li>`).join('');
}

formGasto.addEventListener('submit', async (evento) => {
    evento.preventDefault();


const novoGasto = {
    descricao: campoDescricao.value,
    valor: parseFloat(campoValor.value),
    data: campoData.value,
    categoria_id: Number(campoCategoria.value),
};

await fetch('/api/gastos', {
    method: 'POST',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(novoGasto),
});

formGasto.reset();
carregarGastos();

});
carregarCategorias();
carregarGastos();

