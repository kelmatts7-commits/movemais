async function fetchData() {
  const res = await fetch('data.json');
  return await res.json();
}

function formatPrice(value) {
  return `€${value.toFixed(2)}`;
}

function renderStats(total, origin, date) {
  const stats = document.getElementById('stats');
  const d = date ? new Date(date).toLocaleDateString('pt-PT') : '—';
  stats.textContent = `Resultados: ${total} destinos a partir de ${origin} na data ${d}`;
}

function renderList(items) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  if (items.length === 0) {
    list.innerHTML = '<li class="item">Nenhum destino encontrado com os filtros atuais.</li>';
    return;
  }
  items.forEach((it) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div>
        <strong>${it.destino}</strong> <span class="mode">(${it.meio})</span><br>
        <span class="symbol">${it.simbolo}</span>
      </div>
      <div><span class="badge">${it.tempo_h}h</span></div>
      <div><span class="badge">${formatPrice(it.preco_min)}</span></div>
      <div>${it.tipo.replace('-', ' ')}</div>
      <div>
        <button class="btn-detail" onclick="alert('Em breve: horários e compra direta.')">Ver</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function applyFilters(data, origin, maxTime, maxPrice, type) {
  return data
    .filter((d) => d.origens.includes(origin))
    .filter((d) => d.tempo_h <= maxTime)
    .filter((d) => d.preco_min <= maxPrice)
    .filter((d) => (type ? d.tipo === type : true));
}

async function init() {
  const data = await fetchData();

  const originInput = document.getElementById('origin');
  const dateInput = document.getElementById('date');
  const exploreBtn = document.getElementById('exploreBtn');

  const maxTimeInput = document.getElementById('maxTime');
  const maxPriceInput = document.getElementById('maxPrice');
  const typeSelect = document.getElementById('type');

  function update() {
    const origin = originInput.value.trim() || 'Aveiro';
    const date = dateInput.value;
    const maxTime = Number(maxTimeInput.value);
    const maxPrice = Number(maxPriceInput.value);
    const type = typeSelect.value;

    const results = applyFilters(data, origin, maxTime, maxPrice, type);
    renderStats(results.length, origin, date);
    renderList(results);
  }

  exploreBtn.addEventListener('click', update);
  maxTimeInput.addEventListener('input', update);
  maxPriceInput.addEventListener('input', update);
  typeSelect.addEventListener('change', update);
  originInput.addEventListener('input', update);
  dateInput.addEventListener('change', update);

  // Primeira renderização
  update();
}

init();
