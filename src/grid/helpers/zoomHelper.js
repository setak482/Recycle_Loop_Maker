import { KEYS } from '../../constants/keys.js';

export function applyTransform(manager) {
  manager.world.style.transform = `translate(${manager._offset.x}px, ${manager._offset.y}px) scale(${manager.scale})`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function setZoom(manager, scale, focusX, focusY) {
  const newScale = clamp(scale, manager.minScale, manager.maxScale);
  if (newScale === manager.scale) return;

  const prevScale = manager.scale;
  manager.scale = newScale;

  if (typeof focusX === 'number' && typeof focusY === 'number') {
    const rect = manager.world.getBoundingClientRect();
    const worldX = (focusX - rect.left - manager._offset.x) / prevScale;
    const worldY = (focusY - rect.top - manager._offset.y) / prevScale;
    const offsetX = focusX - rect.left - worldX * newScale;
    const offsetY = focusY - rect.top - worldY * newScale;
    manager._setOffset(offsetX, offsetY);
  } else {
    applyTransform(manager);
  }
}

export function zoomBy(manager, deltaY, focusX, focusY) {
  const direction = deltaY > 0 ? -1 : 1;
  const nextScale = manager.scale + direction * manager.scaleStep;
  setZoom(manager, nextScale, focusX, focusY);
}
