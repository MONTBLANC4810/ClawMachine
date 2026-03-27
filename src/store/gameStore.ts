import { create } from 'zustand';

interface GameState {
  clawPosition: [number, number, number];
  isGrabbing: boolean;
  score: number;
  setClawPosition: (pos: [number, number, number]) => void;
  setGrabbing: (grab: boolean) => void;
  incrementScore: () => void;
  triggerDrop: () => void;
}

// 전역 상태 관리를 위한 Zustand 스토어 (물리 엔진과 UI 사이의 안전한 데이터 교환 목적)
export const useGameStore = create<GameState>((set, get) => ({
  clawPosition: [0, 4, 0], // X축 좌우, Y축 상하, Z축 전후
  isGrabbing: false,       // 집게의 오므림 여부
  score: 0,
  
  // 수동 위치 할당 (조이스틱 및 키보드용)
  setClawPosition: (pos) => set({ clawPosition: pos }),
  setGrabbing: (grab) => set({ isGrabbing: grab }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  
  // 전체 집게 작동 워크플로우 (하강 -> 잡기 -> 복귀 -> 배출구 이동 -> 놓기)
  triggerDrop: () => {
    const state = get();
    // 이미 작동 중이라면 중복 실행 방지
    if (state.isGrabbing) return;

    // 1. 집게를 상품 방향으로 하강시킵니다.
    set({ clawPosition: [state.clawPosition[0], 1.5, state.clawPosition[2]] });

    // CSS 애니메이션처럼 단계별로 시간차 타이머(setTimeout)를 두어 물리 엔진이 따라올 시간을 확보합니다.
    setTimeout(() => {
      // 2. 바닥에 닿은 집게 손가락 오므리기 (잡기)
      set({ isGrabbing: true });
      
      setTimeout(() => {
        // 3. 인형을 쥔 채 상단 원래 높이로 복귀
        const currentClaw = get().clawPosition;
        set({ clawPosition: [currentClaw[0], 4, currentClaw[2]] });
        
        setTimeout(() => {
          // 4. 상품 배출구 (기계 좌측 앞쪽 모서리) 위치로 이동
          set({ clawPosition: [-1.5, 4, 2.75] });
          
          setTimeout(() => {
            // 5. 배출구 위에서 집게 손가락을 벌려 인형 투하
            set({ isGrabbing: false });
          }, 1500); // 놓는 애니메이션 대기
        }, 1500); // 이동 애니메이션 대기
      }, 800); // 잡는 애니메이션 연출 대기
    }, 1500); // 하강 애니메이션 대기
  }
}));
