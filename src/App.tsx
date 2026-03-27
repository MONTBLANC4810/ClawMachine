import { Suspense } from 'react';
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
  const { clawPosition, setClawPosition, isGrabbing, setGrabbing } = useGameStore();

  // 조이스틱 조작
  const moveClaw = (dx: number, dz: number) => {
    if (isGrabbing) return; // 하강 중엔 이동 불가
    const newX = Math.max(-2.5, Math.min(2.5, clawPosition[0] + dx));
    const newZ = Math.max(-3, Math.min(3, clawPosition[2] + dz));
    setClawPosition([newX, clawPosition[1], newZ]);
  };

  const handleDrop = () => {
    if (isGrabbing) return;
    
    // 1. 하강
    setClawPosition([clawPosition[0], 1.5, clawPosition[2]]);
    
    setTimeout(() => {
      // 2. 잡기
      setGrabbing(true);
      
      setTimeout(() => {
        // 3. 상승
        setClawPosition([clawPosition[0], 4, clawPosition[2]]);
        
        setTimeout(() => {
          // 4. 배출구(0, 4, 3)로 이동
          setClawPosition([0, 4, 2.75]);
          
          setTimeout(() => {
            // 5. 놓기
            setGrabbing(false);
          }, 1500);
        }, 1500);
      }, 800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
      {/* 헤더 점수판 */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide uppercase">
          Claw <span className="text-pink-500">Machine</span> Dream
        </h1>
        <div className="bg-white/80 p-4 rounded-xl shadow-xl flex items-center gap-4 pointer-events-auto backdrop-blur">
          <span className="font-bold text-gray-800 text-xl">Score: 0</span>
        </div>
      </div>

      {/* 컨트롤 조이스틱 & 버튼 */}
      <div className="flex justify-between items-end w-full pointer-events-auto">
        {/* D-Pad */}
        <div className="relative w-48 h-48 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center p-2 border-4 border-white/40 shadow-2xl">
          <button 
            className="absolute top-2 bg-white/50 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors"
            onClick={() => moveClaw(0, -0.5)}
          >
            <ArrowUp size={32} color="#333" />
          </button>
          <button 
            className="absolute bottom-2 bg-white/50 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors"
            onClick={() => moveClaw(0, 0.5)}
          >
            <ArrowDown size={32} color="#333" />
          </button>
          <button 
            className="absolute left-2 bg-white/50 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors"
            onClick={() => moveClaw(-0.5, 0)}
          >
            <ArrowLeft size={32} color="#333" />
          </button>
          <button 
            className="absolute right-2 bg-white/50 p-3 rounded-full hover:bg-white active:bg-pink-300 transition-colors"
            onClick={() => moveClaw(0.5, 0)}
          >
            <ArrowRight size={32} color="#333" />
          </button>
          <div className="w-12 h-12 bg-pink-500 rounded-full shadow-inner z-10"></div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleDrop}
          disabled={isGrabbing}
          className={`w-36 h-36 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl transition-all
            ${isGrabbing ? 'bg-gray-400 scale-95' : 'bg-gradient-to-tr from-pink-600 to-pink-400 hover:scale-105 active:scale-95'}`}
        >
          <div className="flex flex-col items-center">
            <MousePointerClick size={48} className="mb-2" />
            <span>DROP</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 border-none overflow-hidden relative">
      <Canvas shadows camera={{ position: [0, 6, 8], fov: 45 }}>
        <fog attach="fog" args={['#202020', 10, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[5, 10, 5]} 
          intensity={1.5} 
          shadow-mapSize={[2048, 2048]} 
        />
        <spotLight position={[0, 8, 0]} intensity={2} angle={0.6} penumbra={0.5} castShadow />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <Machine />
            <Dolls />
            <Claw />
          </Physics>
          
          <Environment preset="city" />
          <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>

        {/* 카메라 움직임 허용 (사용자가 돌려볼 수 있도록) */}
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={15} target={[0, 2, 0]} />
      </Canvas>
      <GameUI />
    </div>
  );
}

export default App;
