export async function loadInstrumentPanel(selectInstrument) {
  const response = await fetch('/data/instruments.json');
  const { instruments } = await response.json();
  const list = document.getElementById('instrument-list');
  list.innerHTML = '';

  instruments.forEach(inst => {
    const item = document.createElement('div');
    item.classList.add('instrument-item');
    item.dataset.id = inst.id;
    const iconSrc = inst.img ?? `/img/${inst.id}.png`;
    item.innerHTML = `<img src="${iconSrc}" alt="${inst.name}" /><span>${inst.name}</span>`;

    item.addEventListener('click', () => selectInstrument(inst.id, item, inst));
    list.appendChild(item);
  });
}
