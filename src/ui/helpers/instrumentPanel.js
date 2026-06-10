import { getInstrumentList } from '../../data/instrumentRegistry.js';

export function loadInstrumentPanel(selectInstrument) {
  const list = document.getElementById('instrument-list');
  list.innerHTML = '';

  const fragment = document.createDocumentFragment();
  getInstrumentList().forEach(inst => {
    const item = document.createElement('div');
    item.classList.add('instrument-item');
    item.dataset.id = inst.id;
    item.innerHTML = `<img src="/img/${inst.id}.png" alt="${inst.name}" /><span>${inst.name}</span>`;

    item.addEventListener('click', () => selectInstrument(inst.id, item));
    fragment.appendChild(item);
  });
  list.appendChild(fragment);
}
