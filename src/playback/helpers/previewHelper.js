import { KEYS } from '../../constants/keys.js';

/**
 * 블록이 놓인 셀의 행(음높이)에 맞는 소리를 즉시 한 번 재생합니다.
 *
 * [실행 흐름]
 * 1. 쉼표처럼 샘플이 없는 악기는 무음 처리
 * 2. Tone이 아직 로드되지 않았다면 이 시점(사용자 입력 직후)에 동적 로드
 * 3. 해당 셀의 샘플러가 없으면 등록하고, 버퍼 로드를 기다린 뒤 트리거
 *
 * @param {PlaybackManager} playbackManager
 * @param {string} cellKey - "col-row" 형식의 셀 키
 * @param {Object} detail - 악기 상세 데이터
 * @returns {Promise<void>}
 */
export async function previewNoteHelper(playbackManager, cellKey, detail) {
  if (!detail?.sample?.notes || Object.keys(detail.sample.notes).length === 0) return;

  const rowIndex = parseInt(cellKey.split('-')[1], 10);
  const note = KEYS[rowIndex]?.note;
  if (!note) return;

  if (!playbackManager._Tone) {
    playbackManager._Tone = await import('tone');
    playbackManager._Tone.Destination.volume.value = playbackManager.masterVolume;
  }
  const Tone = playbackManager._Tone;
  await Tone.start();

  if (!playbackManager._samplers.has(cellKey)) {
    playbackManager.register(cellKey, detail);
  }
  const sampler = playbackManager._samplers.get(cellKey);
  if (!sampler) return;

  if (!sampler.loaded) {
    await Tone.loaded();
  }
  // 버퍼 로드를 기다리는 사이 오브젝트가 제거되었을 수 있음
  if (playbackManager._samplers.get(cellKey) !== sampler || !sampler.loaded) return;

  sampler.triggerAttackRelease(note, detail.duration ?? 1);
}
