document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.querySelector('#tabelaLucros tbody');
  const token = localStorage.getItem('token'); // ou 'authToken' conforme estiver salvo

  if (!token) {
    alert('Você precisa estar logado.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const resposta = await fetch('http://localhost:5000/vendas/lucros/mensal', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dados = await resposta.json();

    if (!resposta.ok) throw new Error('Erro na resposta da API');

    if (!Array.isArray(dados) || dados.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="2" style="text-align: center; padding: 15px; color: #555;">
            Nenhum lucro registrado até o momento. Volte mais tarde ou registre as venda do mês.
          </td>
        </tr>
      `;
      return;
    }

    dados.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${item.mes}</td>
        <td>R$ ${parseFloat(item.lucro_total).toFixed(2).replace('.', ',')}</td>
      `;
      tabela.appendChild(linha);
    });

  } catch (erro) {
    console.error('Erro ao buscar dados:', erro);
    tabela.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; padding: 15px; color: red;">
            Nenhum lucro registrado até o momento. Volte mais tarde ou registre as venda do mês.
        </td>
      </tr>
    `;
  }
});

document.getElementById('btnVoltar').addEventListener('click', () => {
  window.location.href = 'admin-vendas.html';
});
