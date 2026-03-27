import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, SoftShadows } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Machine } from './components/Machine';
import { Dolls } from './components/Dolls';
import { Claw } from './components/Claw';
import { useGameStore } from './store/gameStore';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, MousePointerClick } from 'lucide-react';
import './App.css';

function GameUI() {
  const { clawPosition, setClawPosition, isGrabbing, triggerDrop } = useGameStore();

  // 조이스틱 및 키보드용 이동 함수
  const moveClaw = (dx: number, dz: number) => {
    const state = useGameStore.getState();
    if (state.isGrabbing) return; // 하강 중엔 이동 불가
    
    const currentPos = state.clawPosition;
    const newX = Math.max(-2.5, Math.min(2.5, currentPos[0] + dx));
    const newZ = Math.max(-3, Math.min(3, currentPos[2] + dz));
    state.setClawPosition([newX, currentPos[1], newZ]);
  };

  // 키보드 이벤트 리스너 부착
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 방향키 조작 (상, 하, 좌, 우)
      if (e.key === 'ArrowUp') moveClaw(0, -0.5);
      if (e.key === 'ArrowDown') moveClaw(0, 0.5);
      if (e.key === 'ArrowLeft') moveClaw(-0.5, 0);
      if (e.key === 'ArrowRight') moveClaw(0.5, 0);
      
      // 스페이스바 조작 (드롭)
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault(); // 스페이스바로 브라우저가 스크롤되는 현상 방지
        const state = useGameStore.getState();
        if (!state.isGrabbing) {
          state.triggerDrop();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
      {/* 타이틀 및 점수판 */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-lg tracking-wide uppercase">
            Claw Machine
          </h1>
          <p className="text-white/80 font-semibold mt-2 drop-shadow-md">
            Use <span className="text-pink-300">Arrow Keys</span> to Move, <span className="text-pink-300">Spacebar</span> to Drop
          </p>
        </div>
        <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-2xl flex items-center border border-pink-200 pointer-events-auto backdrop-blur">
          <span className="font-extrabold text-pink-600 text-2xl tracking-tight">SCORE : 0</span>
        </div>
      </div>

      {/* 컨트롤 조이스틱 & 버튼 */}
      <div className="flex justify-between items-end w-full pointer-events-auto">
        {/* D-Pad */}
        <div className="relative w-48 h-48 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center p-2 border border-white/30 shadow-[0_0_30px_rgba(255,105,180,0.3)]">
          <button 
            className="absolute top-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg"
            onClick={() => moveClaw(0, -0.5)}
          >
            <ArrowUp size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button 
            className="absolute bottom-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg"
            onClick={() => moveClaw(0, 0.5)}
          >
            <ArrowDown size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button 
            className="absolute left-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg"
            onClick={() => moveClaw(-0.5, 0)}
          >
            <ArrowLeft size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button 
            className="absolute right-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg"
            onClick={() => moveClaw(0.5, 0)}
          >
            <ArrowRight size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-[inset_0_-4px_6px_rgba(0,0,0,0.3)] z-10"></div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => triggerDrop()}
          disabled={isGrabbing}
          className={`w-40 h-40 rounded-full flex items-center justify-center text-white font-extrabold text-3xl shadow-[0_10px_40px_rgba(236,72,153,0.5)] transition-all border-4 border-white/20
            ${isGrabbing ? 'bg-gray-500 scale-95 shadow-none opacity-50' : 'bg-gradient-to-b from-pink-400 to-pink-600 hover:scale-105 active:scale-95 active:shadow-inner'}`}
        >
          <div className="flex flex-col items-center drop-shadow-md">
            <MousePointerClick size={48} className="mb-2 opacity-90" />
            <span className="tracking-widest">DROP</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-screen h-screen bg-slate-900 border-none overflow-hidden relative">
      <Canvas shadows camera={{ position: [0, 6, 9], fov: 45 }}>
        <fog attach="fog" args={['#0f172a', 15, 30]} />
        <color attach="background" args={['#0f172a']} />
        
        {/* 아주 부드럽고 사실적인 그림자 (SoftShadows) 컴포넌트로 리얼리티 향상 */}
        <SoftShadows size={25} samples={16} focus={0.5} />
        
        {/* 현실적인 스튜디오 조명 세팅 */}
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight 
          castShadow 
          position={[5, 12, 8]} 
          intensity={2.5} 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
          color="#fff0e6" /* 살짝 따뜻한 조명 */
        />
        <spotLight position={[-5, 8, -5]} intensity={3} color="#e0e7ff" angle={0.8} penumbra={1} castShadow />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Machine />
            <Dolls />
            <Claw />
          </Physics>
          
          {/* 환경 반사맵 (실내 스튜디오 느낌으로 사실적인 유리 반사 제공) */}
          <Environment preset="apartment" />
          
          <ContactShadows position={[0, -0.4, 0]} opacity={0.7} scale={15} blur={2.5} far={4} color="#000000" />
        </Suspense>

        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={20} target={[0, 2, 0]} enableDamping dampingFactor={0.05} />
      </Canvas>
      <GameUI />
    </div>
  );
}

export default App;
