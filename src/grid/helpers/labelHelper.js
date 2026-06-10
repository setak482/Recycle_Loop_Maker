import { KEYS } from '../../constants/keys.js';

export function createRowLabels(manager) {
  const container = document.createElement('div');
  container.id = 'grid-labels';
  container.className = 'grid-labels';

  KEYS.forEach(key => {
    const label = document.createElement('div');
    label.className = 'grid-label';
    label.textContent = key.note;
    container.appendChild(label);
  });

  manager.labelContainer = container;
  manager.canvas.appendChild(container);
}

export function updateRowLabelTransform(manager) {
  if (!manager.labelContainer) return;
  manager.labelContainer.style.transform = `translateY(${manager._offset.y}px) scale(${manager.scale})`;
}
