import { create } from 'zustand';

interface GameState {
  clawPosition: [number, number, number];
  isGrabbing: boolean;
  score: number;
  setClawPosition: (pos: [number, number, number]) => void;
  setGrabbing: (grab: boolean) => void;
  incrementScore: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  clawPosition: [0, 4, 0], // X, Y, Z
  isGrabbing: false,
  score: 0,
  setClawPosition: (pos) => set({ clawPosition: pos }),
  setGrabbing: (grab) => set({ isGrabbing: grab }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
}));
