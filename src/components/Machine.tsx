import { RigidBody } from '@react-three/rapier';
import { Box, Cylinder, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 실사 인형뽑기 기계 외형
 * - 금속 프레임 기둥 4개
 * - 투명 유리 패널 4면
 * - 상단 기계실 (모터가 들어있는 상자)
 * - 하단 받침대 (LED 스트립 장식)
 * - 상품 배출구 (앞면 아래)
 */
export const Machine = () => {
  // 기계 전체 치수
  const W = 5;   // 가로 폭
  const D = 5;   // 세로 깊이
  const H = 7;   // 유리 영역 높이
  const FRAME = 0.15; // 프레임 두께
  const BASE_H = 1.2; // 받침대 높이

  // 금속 재질 (스테인리스 느낌)
  const metalMat = (
    <meshStandardMaterial
      color="#c0c0c0"
      metalness={0.95}
      roughness={0.15}
    />
  );

  // 어두운 금속 프레임
  const darkMetalMat = (
    <meshStandardMaterial
      color="#3a3a3a"
      metalness={0.9}
      roughness={0.25}
    />
  );

  // 유리 재질 (투명하고 반사가 있는 실물 유리)
  const glassMat = (
    <meshPhysicalMaterial
      color="#ffffff"
      transmission={0.95}
      thickness={0.05}
      roughness={0.02}
      metalness={0}
      ior={1.5}
      transparent
      opacity={0.3}
      side={THREE.DoubleSide}
      envMapIntensity={1}
    />
  );

  return (
    <group>
      {/* ===== 받침대 (하단 사각 박스) ===== */}
      <RigidBody type="fixed">
        <RoundedBox args={[W + 0.6, BASE_H, D + 0.6]} position={[0, BASE_H / 2, 0]} radius={0.05} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
        </RoundedBox>
      </RigidBody>

      {/* 받침대 LED 스트립 장식 (앞면) */}
      <mesh position={[0, BASE_H * 0.75, D / 2 + 0.31]}>
        <boxGeometry args={[W + 0.4, 0.08, 0.02]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={3} />
      </mesh>
      {/* LED 배면 */}
      <mesh position={[0, BASE_H * 0.75, -(D / 2 + 0.31)]}>
        <boxGeometry args={[W + 0.4, 0.08, 0.02]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={3} />
      </mesh>
      {/* LED 좌측 */}
      <mesh position={[-(W / 2 + 0.31), BASE_H * 0.75, 0]}>
        <boxGeometry args={[0.02, 0.08, D + 0.4]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={3} />
      </mesh>
      {/* LED 우측 */}
      <mesh position={[(W / 2 + 0.31), BASE_H * 0.75, 0]}>
        <boxGeometry args={[0.02, 0.08, D + 0.4]} />
        <meshStandardMaterial color="#ff69b4" emissive="#ff69b4" emissiveIntensity={3} />
      </mesh>

      {/* ===== 바닥판 (인형이 놓이는 실제 물리 바닥) ===== */}
      <RigidBody type="fixed" friction={0.8} restitution={0.05}>
        <Box args={[W, 0.15, D]} position={[0, BASE_H + 0.075, 0]} receiveShadow>
          <meshStandardMaterial color="#f0e6d3" metalness={0.05} roughness={0.7} />
        </Box>
      </RigidBody>

      {/* ===== 금속 프레임 기둥 4개 ===== */}
      {[
        [-W / 2, 0, -D / 2],
        [W / 2, 0, -D / 2],
        [-W / 2, 0, D / 2],
        [W / 2, 0, D / 2],
      ].map((pos, i) => (
        <RigidBody key={`pillar-${i}`} type="fixed">
          <RoundedBox
            args={[FRAME, H, FRAME]}
            position={[pos[0], BASE_H + H / 2, pos[2]]}
            radius={0.03}
            castShadow
          >
            {darkMetalMat}
          </RoundedBox>
        </RigidBody>
      ))}

      {/* ===== 상단 수평 프레임 (4변 상단 연결) ===== */}
      {[
        { pos: [0, BASE_H + H, -D / 2] as [number, number, number], size: [W + FRAME, FRAME, FRAME] as [number, number, number] },
        { pos: [0, BASE_H + H, D / 2] as [number, number, number], size: [W + FRAME, FRAME, FRAME] as [number, number, number] },
        { pos: [-W / 2, BASE_H + H, 0] as [number, number, number], size: [FRAME, FRAME, D + FRAME] as [number, number, number] },
        { pos: [W / 2, BASE_H + H, 0] as [number, number, number], size: [FRAME, FRAME, D + FRAME] as [number, number, number] },
      ].map((bar, i) => (
        <RigidBody key={`top-bar-${i}`} type="fixed">
          <Box args={bar.size} position={bar.pos} castShadow>
            {darkMetalMat}
          </Box>
        </RigidBody>
      ))}

      {/* ===== 유리 패널 4면 (물리 충돌 벽) ===== */}
      <RigidBody type="fixed" friction={0}>
        {/* 뒤 */}
        <Box args={[W, H, 0.02]} position={[0, BASE_H + H / 2, -D / 2]}>
          {glassMat}
        </Box>
        {/* 앞 */}
        <Box args={[W, H, 0.02]} position={[0, BASE_H + H / 2, D / 2]}>
          {glassMat}
        </Box>
        {/* 좌 */}
        <Box args={[0.02, H, D]} position={[-W / 2, BASE_H + H / 2, 0]}>
          {glassMat}
        </Box>
        {/* 우 */}
        <Box args={[0.02, H, D]} position={[W / 2, BASE_H + H / 2, 0]}>
          {glassMat}
        </Box>
      </RigidBody>

      {/* ===== 상단 기계실 (모터/레일이 들어있는 상자) ===== */}
      <RigidBody type="fixed">
        <RoundedBox
          args={[W + 0.6, 1.5, D + 0.6]}
          position={[0, BASE_H + H + 0.75, 0]}
          radius={0.05}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#16213e" metalness={0.85} roughness={0.25} />
        </RoundedBox>
      </RigidBody>

      {/* 상단 LED */}
      <mesh position={[0, BASE_H + H + 1.51, D / 2 + 0.31]}>
        <boxGeometry args={[W + 0.4, 0.06, 0.02]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={4} />
      </mesh>

      {/* ===== 레일 (X축 / Z축 레일 – 집게가 달리는 선로) ===== */}
      <Cylinder args={[0.04, 0.04, W - 0.2, 8]} position={[0, BASE_H + H - 0.3, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        {metalMat}
      </Cylinder>
      <Cylinder args={[0.04, 0.04, W - 0.2, 8]} position={[0, BASE_H + H - 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        {metalMat}
      </Cylinder>

      {/* ===== 상품 배출구 (앞면 아래, 반원 구멍 표현) ===== */}
      <group position={[-1, BASE_H + 0.1, D / 2 + 0.15]}>
        <RoundedBox args={[1.8, 0.8, 0.6]} radius={0.15} castShadow>
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <Box args={[1.4, 0.5, 0.4]} position={[0, 0.05, -0.05]}>
          <meshStandardMaterial color="#000000" />
        </Box>
      </group>

      {/* ===== 내부 스포트라이트 (기계 내부 상품 비추기) ===== */}
      <spotLight
        position={[0, BASE_H + H - 0.5, 0]}
        angle={0.9}
        penumbra={0.8}
        intensity={5}
        color="#ffe4c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[1.5, BASE_H + 2, 1.5]} intensity={1} color="#ffd700" />
      <pointLight position={[-1.5, BASE_H + 2, -1.5]} intensity={1} color="#ffd700" />
    </group>
  );
};
