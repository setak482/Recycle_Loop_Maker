import instrumentsIndex from './instruments.json';

// 악기 상세 JSON을 빌드 타임에 번들로 포함합니다.
// 런타임 fetch가 없어 프로덕션 빌드에서도 동작하며, 배치 때마다
// 네트워크 요청 + JSON 파싱이 반복되지 않습니다.
const detailModules = import.meta.glob('./instruments/*.json', {
  eager: true,
  import: 'default',
});

const details = new Map();
for (const path in detailModules) {
  const detail = detailModules[path];
  if (detail?.id) details.set(detail.id, detail);
}

export function getInstrumentList() {
  return instrumentsIndex.instruments;
}

export function getInstrumentDetail(id) {
  return details.get(id) ?? null;
}
