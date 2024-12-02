document.getElementById('votar').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const candidatoSelecionado = document.querySelector('input[name="candidato"]:checked');
  
    if (!nome) {
      alert('Por favor, digite seu nome.');
      return;
    }
  
    if (!candidatoSelecionado) {
      alert('Por favor, selecione um candidato.');
      return;
    }
  
    const candidato = candidatoSelecionado.value;
  
    try {
      const response = await fetch('http://192.168.25.83:3000/votar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, candidato }),
      });
  
      if (response.ok) {
        alert(`Obrigado por votar, ${nome}! Seu voto para ${candidato} foi computado.`);
        atualizarResultados();
      } else {
        alert('Erro ao registrar o voto.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  });
  
  document.getElementById('zerarVotos').addEventListener('click', async () => {
    try {
      const response = await fetch('http://192.168.25.83:3000/zerar', {
        method: 'POST',
      });
  
      if (response.ok) {
        alert('Todos os votos foram zerados.');
        atualizarResultados();
      } else {
        alert('Erro ao zerar os votos.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  });
  
  async function atualizarResultados() {
    try {
      const response = await fetch('http://192.168.25.83:3000/resultados');
      if (response.ok) {
        const resultados = await response.json();
        document.getElementById('votosCandidato1').textContent = resultados.find(r => r.candidato === 'Candidato 1')?.votos || 0;
        document.getElementById('votosCandidato2').textContent = resultados.find(r => r.candidato === 'Candidato 2')?.votos || 0;
        document.getElementById('votosCandidato3').textContent = resultados.find(r => r.candidato === 'Candidato 3')?.votos || 0;
      } else {
        alert('Erro ao obter os resultados.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  // Atualizar os resultados ao carregar a página
  atualizarResultados();