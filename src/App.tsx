import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Machine } from './components/Machine';
import { Dolls } from './components/Dolls';
import { Claw } from './components/Claw';
import { useGameStore } from './store/gameStore';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, MousePointerClick } from 'lucide-react';
import './App.css';

function GameUI() {
  const { isGrabbing, triggerDrop } = useGameStore();

  const moveClaw = (dx: number, dz: number) => {
    const state = useGameStore.getState();
    if (state.isGrabbing) return;
    const currentPos = state.clawPosition;
    const newX = Math.max(-2, Math.min(2, currentPos[0] + dx));
    const newZ = Math.max(-2, Math.min(2, currentPos[2] + dz));
    state.setClawPosition([newX, currentPos[1], newZ]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':    moveClaw(0, -0.4); break;
        case 'ArrowDown':  moveClaw(0, 0.4);  break;
        case 'ArrowLeft':  moveClaw(-0.4, 0); break;
        case 'ArrowRight': moveClaw(0.4, 0);  break;
        case ' ':
          e.preventDefault();
          useGameStore.getState().triggerDrop();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
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

      <div className="flex justify-between items-end w-full pointer-events-auto">
        <div className="relative w-48 h-48 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center p-2 border border-white/30 shadow-[0_0_30px_rgba(255,105,180,0.3)]">
          <button className="absolute top-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg" onClick={() => moveClaw(0, -0.4)}>
            <ArrowUp size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button className="absolute bottom-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg" onClick={() => moveClaw(0, 0.4)}>
            <ArrowDown size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button className="absolute left-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg" onClick={() => moveClaw(-0.4, 0)}>
            <ArrowLeft size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <button className="absolute right-2 bg-white/70 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors shadow-lg" onClick={() => moveClaw(0.4, 0)}>
            <ArrowRight size={32} color="#f472b6" strokeWidth={3} />
          </button>
          <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-[inset_0_-4px_6px_rgba(0,0,0,0.3)] z-10"></div>
        </div>

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
    <div className="w-screen h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-none overflow-hidden relative">
      <Canvas
        shadows
        camera={{ position: [0, 7, 12], fov: 40 }}
      >
        <color attach="background" args={['#1a1a2e']} />

        {/* 강한 조명 */}
        <ambientLight intensity={2} />
        <directionalLight
          castShadow
          position={[8, 15, 10]}
          intensity={3}
          shadow-mapSize={[1024, 1024]}
          color="#fff5ee"
        />
        <directionalLight position={[-5, 10, -5]} intensity={2} color="#e0e7ff" />
        <pointLight position={[0, 10, 5]} intensity={3} color="#ffffff" />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Machine />
            <Dolls />
            <Claw />
          </Physics>

          <Environment preset="apartment" background={false} />
          <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} far={6} />
        </Suspense>

        <OrbitControls
          makeDefault
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={25}
          target={[0, 4, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      <GameUI />
    </div>
  );
}

export default App;
