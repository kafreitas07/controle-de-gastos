const formGasto = document.getElementById('formGasto');
const campoDescricao = document.getElementById('descricao');
const campoValor = document.getElementById('valor');
const campoData = document.getElementById('data');
const campoCategoria = document.getElementById('categoria');
const listaGastoEl = document.getElementById('listaGastos');
const campoId = document.getElementById('gastoId');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');



async function carregarCategorias(){
    const resposta = await fetch('/api/categorias');
    const categorias = await resposta.json();

    campoCategoria.innerHTML = categorias.map(cat => `<option value="${cat.id}">${cat.nome}</option>`).join('');
}

async function carregarGastos() {
    const resposta = await fetch('/api/gastos');
    const gastos = await resposta.json();

    listaGastoEl.innerHTML = gastos.map(g => `
        <li>
        ${g.descricao} - R$ ${g.valor} - ${g.categoria}
    <button onclick = "editarGasto(${g.id})">editar</button>
    <button onclick = "excluirGasto(${g.id})">excluir</button>
    
    </li>`)
    .join('');
}


//busca a lista intera para encontrar o id clicado ou undefined se não encontrar
async function editarGasto(id) {
    const resposta = await fetch('/api/gastos');
    const gastos = await resposta.json();
    const gasto = gastos.find(g => g.id === id);
    if(!gasto) return;


    campoId.value = gasto.id;
    campoDescricao.value = gasto.descricao;
    campoValor.value = gasto.valor;
    campoData.value = gasto.data;
    campoCategoria.value = gasto.categoria_id;

    btnSalvar.textContent = 'Salvar Edição';
    btnCancelar.hidden = false; 
}

async function excluirGasto(id){
    const confirmar= confirm('Excluir este gasto?');
    if(!confirmar) return;

    await fetch(`/api/gastos/${id}`, {method:'DELETE'});
    carregarGastos();
}

function sairModoEdicao() {
  formGasto.reset();
  campoId.value = '';
  btnSalvar.textContent = 'Adicionar gasto';
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener('click', sairModoEdicao);

formGasto.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const dadosGasto = {
    descricao: campoDescricao.value,
    valor: parseFloat(campoValor.value),
    data: campoData.value,
    categoria_id: Number(campoCategoria.value),
  };

  const idEdicao = campoId.value;

  if (idEdicao) {
    await fetch(`/api/gastos/${idEdicao}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosGasto),
    });
  } else {
    await fetch('/api/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosGasto),
    });
  }

  sairModoEdicao();
  carregarGastos();
});
carregarCategorias();
 carregarGastos();

