function preencherData() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  
  const campoData = document.getElementById('dataLancamento');
  if (campoData) {
    campoData.value = `${dia}/${mes}/${ano}`;
  }
}

// Formatação monetária ao sair do campo
function formatarParaReais(campo) {
  let valor = parseFloat(campo.value.replace(',', '.'));
  if (!isNaN(valor)) campo.value = valor.toFixed(2).replace('.', ',');
}

const camposFormatar = ['custo', 'taxaFixa', 'frete', 'gestao', 'venda'];
camposFormatar.forEach(id => {
  const campo = document.getElementById(id);
  if (campo) {
    campo.addEventListener('blur', () => formatarParaReais(campo));
  }
});

const usuarioLogado = localStorage.getItem('usuarioLogado');
const chaveLancamentos = `lancamentos_${usuarioLogado}`;

function calcularLucro() {
  const custo = parseFloat(document.getElementById('custo').value.replace(',', '.')) || 0;
  const taxa = parseFloat(document.getElementById('taxaFixa').value.replace(',', '.')) || 0;
  const frete = parseFloat(document.getElementById('frete').value.replace(',', '.')) || 0;
  const gestao = parseFloat(document.getElementById('gestao').value.replace(',', '.')) || 0;
  const venda = parseFloat(document.getElementById('venda').value.replace(',', '.')) || 0;

  const lucro = venda - (custo + taxa + frete + gestao);
  document.getElementById('lucro').value = lucro.toFixed(2).replace('.', ',');
  return lucro;
}

function salvarLancamento() {
  const lucro = calcularLucro();
  const lancamento = {
    data: document.getElementById('dataLancamento').value,
    descricao: document.getElementById('descricao').value,
    estoque: document.getElementById('estoque').value,
    custo: document.getElementById('custo').value,
    taxa: document.getElementById('taxaFixa').value,
    frete: document.getElementById('frete').value,
    gestao: document.getElementById('gestao').value,
    venda: document.getElementById('venda').value,
    lucro: lucro.toFixed(2).replace('.', ',')
  };

  const lancamentos = JSON.parse(localStorage.getItem(chaveLancamentos)) || [];
  lancamentos.push(lancamento);
  localStorage.setItem(chaveLancamentos, JSON.stringify(lancamentos));
  atualizarTabela();
}

function atualizarTabela() {
  const lancamentos = JSON.parse(localStorage.getItem(chaveLancamentos)) || [];
  const corpoTabela = document.getElementById('corpoTabela');
  corpoTabela.innerHTML = '';
  let total = 0;

  lancamentos.forEach((l, i) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${l.data}</td>
      <td>${l.descricao}</td>
      <td>${l.estoque}</td>
      <td>${l.custo}</td>
      <td>${l.taxa}</td>
      <td>${l.frete}</td>
      <td>${l.gestao}</td>
      <td>${l.venda}</td>
      <td>${l.lucro}</td>
      <td><button onclick="excluirLancamento(${i})" class="excluir">Excluir</button></td>
    `;
    corpoTabela.appendChild(linha);
    total += parseFloat(l.lucro.replace(',', '.'));
  });

  document.getElementById('totalLucro').value = total.toFixed(2).replace('.', ',');
}

function validarCampos() {
  const campos = ['dataLancamento', 'descricao', 'estoque', 'custo', 'taxaFixa', 'frete', 'gestao', 'venda'];
  for (const campo of campos) {
    const elemento = document.getElementById(campo);
    if (!elemento.value) {
      alert(`O campo ${elemento.placeholder} é obrigatório.`);
      elemento.focus();
      return false;
    }
  }
  return true;
} 

function excluirLancamento(index) {
  const lancamentos = JSON.parse(localStorage.getItem(chaveLancamentos)) || [];
  lancamentos.splice(index, 1);
  localStorage.setItem(chaveLancamentos, JSON.stringify(lancamentos));
  atualizarTabela();
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

document.getElementById('btnCalcular').addEventListener('click', salvarLancamento);
document.getElementById('btnLogout').addEventListener('click', logout);

document.getElementById('dataLancamento').addEventListener('focus', function () {
  this.type = 'date';
});
document.getElementById('dataLancamento').addEventListener('blur', function () {
  this.type = 'text';
});

window.onload = () => {
  preencherData();
  atualizarTabela();
};

document.getElementById('custo').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    salvarLancamento();
  }
});

// Detecta cliques nos botões "Editar"
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btnEditar')) {
    const index = event.target.dataset.index;
    editarLancamento(index);
  }
});

// Detecta cliques nos botões "Excluir"
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btnExcluir')) {
    const index = event.target.dataset.index;
    excluirLancamento(index);
  }
});

