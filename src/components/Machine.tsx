import { RigidBody } from '@react-three/rapier';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 실사 인형뽑기 기계 외형
 * - 금속 프레임 기둥 4개 + 투명 유리 패널 4면
 * - 상단 기계실 + 하단 받침대 (LED 장식)
 * - 상품 배출구
 * - 내부 스포트라이트
 */
export const Machine = () => {
  const W = 5;
  const D = 5;
  const H = 7;
  const FRAME = 0.15;
  const BASE_H = 1.2;

  return (
    <group>
      {/* ===== 받침대 ===== */}
      <RigidBody type="fixed">
        <Box args={[W + 0.6, BASE_H, D + 0.6]} position={[0, BASE_H / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
        </Box>
      </RigidBody>

      {/* 받침대 LED 스트립 */}
      {[
        { pos: [0, BASE_H * 0.75, D / 2 + 0.31] as [number, number, number], size: [W + 0.4, 0.08, 0.02] as [number, number, number] },
        { pos: [0, BASE_H * 0.75, -(D / 2 + 0.31)] as [number, number, number], size: [W + 0.4, 0.08, 0.02] as [number, number, number] },
        { pos: [-(W / 2 + 0.31), BASE_H * 0.75, 0] as [number, number, number], size: [0.02, 0.08, D + 0.4] as [number, number, number] },
        { pos: [(W / 2 + 0.31), BASE_H * 0.75, 0] as [number, number, number], size: [0.02, 0.08, D + 0.4] as [number, number, number] },
      ].map((led, i) => (
        <mesh key={`led-${i}`} position={led.pos}>
          <boxGeometry args={led.size} />
          <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={3} />
        </mesh>
      ))}

      {/* ===== 바닥판 ===== */}
      <RigidBody type="fixed" friction={0.8} restitution={0.05}>
        <Box args={[W, 0.15, D]} position={[0, BASE_H + 0.075, 0]} receiveShadow>
          <meshStandardMaterial color="#f0e6d3" roughness={0.7} />
        </Box>
      </RigidBody>

      {/* ===== 프레임 기둥 4개 ===== */}
      {[
        [-W / 2, 0, -D / 2],
        [W / 2, 0, -D / 2],
        [-W / 2, 0, D / 2],
        [W / 2, 0, D / 2],
      ].map((pos, i) => (
        <RigidBody key={`pillar-${i}`} type="fixed">
          <Box args={[FRAME, H, FRAME]} position={[pos[0], BASE_H + H / 2, pos[2]]} castShadow>
            <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.25} />
          </Box>
        </RigidBody>
      ))}

      {/* ===== 상단 수평 프레임 ===== */}
      {[
        { pos: [0, BASE_H + H, -D / 2] as [number, number, number], size: [W + FRAME, FRAME, FRAME] as [number, number, number] },
        { pos: [0, BASE_H + H, D / 2] as [number, number, number], size: [W + FRAME, FRAME, FRAME] as [number, number, number] },
        { pos: [-W / 2, BASE_H + H, 0] as [number, number, number], size: [FRAME, FRAME, D + FRAME] as [number, number, number] },
        { pos: [W / 2, BASE_H + H, 0] as [number, number, number], size: [FRAME, FRAME, D + FRAME] as [number, number, number] },
      ].map((bar, i) => (
        <RigidBody key={`top-bar-${i}`} type="fixed">
          <Box args={bar.size} position={bar.pos} castShadow>
            <meshStandardMaterial color="#3a3a3a" metalness={0.9} roughness={0.25} />
          </Box>
        </RigidBody>
      ))}

      {/* ===== 유리 패널 4면 ===== */}
      <RigidBody type="fixed" friction={0}>
        <Box args={[W, H, 0.02]} position={[0, BASE_H + H / 2, -D / 2]}>
          <meshStandardMaterial color="#aaddff" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.05} />
        </Box>
        <Box args={[W, H, 0.02]} position={[0, BASE_H + H / 2, D / 2]}>
          <meshStandardMaterial color="#aaddff" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.05} />
        </Box>
        <Box args={[0.02, H, D]} position={[-W / 2, BASE_H + H / 2, 0]}>
          <meshStandardMaterial color="#aaddff" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.05} />
        </Box>
        <Box args={[0.02, H, D]} position={[W / 2, BASE_H + H / 2, 0]}>
          <meshStandardMaterial color="#aaddff" transparent opacity={0.15} side={THREE.DoubleSide} roughness={0.05} />
        </Box>
      </RigidBody>

      {/* ===== 상단 기계실 ===== */}
      <RigidBody type="fixed">
        <Box args={[W + 0.6, 1.5, D + 0.6]} position={[0, BASE_H + H + 0.75, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#16213e" metalness={0.85} roughness={0.25} />
        </Box>
      </RigidBody>

      {/* 상단 LED */}
      <mesh position={[0, BASE_H + H + 1.51, D / 2 + 0.31]}>
        <boxGeometry args={[W + 0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={4} />
      </mesh>

      {/* ===== 레일 ===== */}
      <Cylinder args={[0.04, 0.04, W - 0.2, 8]} position={[0, BASE_H + H - 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, W - 0.2, 8]} position={[0, BASE_H + H - 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </Cylinder>

      {/* ===== 상품 배출구 ===== */}
      <group position={[-1, BASE_H + 0.1, D / 2 + 0.15]}>
        <Box args={[1.8, 0.8, 0.6]} castShadow>
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
        </Box>
        <Box args={[1.4, 0.5, 0.4]} position={[0, 0.05, -0.05]}>
          <meshStandardMaterial color="#000000" />
        </Box>
      </group>

      {/* ===== 내부 조명 ===== */}
      <spotLight
        position={[0, BASE_H + H - 0.5, 0]}
        angle={0.9}
        penumbra={0.8}
        intensity={8}
        color="#ffe4c4"
        castShadow
      />
      <pointLight position={[1.5, BASE_H + 2, 1.5]} intensity={2} color="#ffd700" />
      <pointLight position={[-1.5, BASE_H + 2, -1.5]} intensity={2} color="#ffd700" />
    </group>
  );
};
