import { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 캐릭터별 색상 및 디테일 정보
 * - 유저가 올린 참고 이미지 기반으로 각 캐릭터의 대표색과 형태적 특징을 매핑
 */
const CHARACTER_CONFIG = {
  monchhichi: {
    bodyColor: '#5C3317',  // 진한 갈색 털
    faceColor: '#F5C5A3',  // 살색 얼굴
    accent: '#FF0000',     // 빨간 턱받이
    bodyShape: 'round' as const,
    hasEars: 'round' as const,
    hairTuft: true,
  },
  labubu: {
    bodyColor: '#4A3F35',  // 어두운 갈색/회색 퍼
    faceColor: '#F5DEB3',  // 베이지 얼굴
    accent: '#C0A080',
    bodyShape: 'round' as const,
    hasEars: 'pointy' as const,
    hairTuft: false,
  },
  cryingbaby: {
    bodyColor: '#FFB6C1',  // 핑크 바디
    faceColor: '#FFE4E1',  // 밝은 살색
    accent: '#87CEEB',     // 파란 모자
    bodyShape: 'chubby' as const,
    hasEars: 'none' as const,
    hairTuft: false,
  },
  rakko: {
    bodyColor: '#FFF5E1',  // 크림색(먼작귀 참고)
    faceColor: '#FFF5E1',
    accent: '#333333',
    bodyShape: 'ball' as const,
    hasEars: 'tiny' as const,
    hairTuft: false,
  },
  hachiware: {
    bodyColor: '#FFFFFF',  // 흰색 바디
    faceColor: '#FFFFFF',
    accent: '#6EB5D9',    // 파란색 포인트 (리본, 꼬리)
    bodyShape: 'round' as const,
    hasEars: 'cat' as const,
    hairTuft: false,
  },
  hangyodon: {
    bodyColor: '#7EC8C8',  // 민트/터콰이즈
    faceColor: '#7EC8C8',
    accent: '#E8A0B0',    // 분홍 입술
    bodyShape: 'chubby' as const,
    hasEars: 'fin' as const,
    hairTuft: false,
  },
} as const;

type CharacterType = keyof typeof CHARACTER_CONFIG;

/**
 * 개별 인형 컴포넌트
 * - 각 캐릭터의 특징을 살린 3D 메쉬 조합
 * - 실사에 가까운 "솜인형" 재질감 (roughness 높임, metalness 낮춤)
 */
const Doll = ({ type, position }: { type: CharacterType; position: [number, number, number] }) => {
  const config = CHARACTER_CONFIG[type];

  // 인형 특유의 솜같은 매트한 표면 재질
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.bodyColor,
    roughness: 0.95,
    metalness: 0.0,
  }), [config.bodyColor]);

  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.faceColor,
    roughness: 0.85,
    metalness: 0.0,
  }), [config.faceColor]);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.accent,
    roughness: 0.8,
    metalness: 0.0,
  }), [config.accent]);

  const eyeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.2,
    metalness: 0.3,
  }), []);

  const bodyScale = config.bodyShape === 'ball' ? 0.55 : config.bodyShape === 'chubby' ? 0.5 : 0.42;

  return (
    <RigidBody
      colliders="ball"
      position={position}
      mass={0.8}
      friction={1.2}
      restitution={0.05}
      linearDamping={0.5}
      angularDamping={0.8}
    >
      <group>
        {/* 몸통 (둥글둥글한 구체) */}
        <Sphere args={[bodyScale, 16, 16]} castShadow receiveShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>

        {/* 머리 (몸통 위 약간 겹쳐서 자연스러운 인형 실루엣) */}
        <Sphere args={[bodyScale * 0.75, 16, 16]} position={[0, bodyScale * 0.7, 0]} castShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>

        {/* 얼굴 패치 (앞면에 살색 원) */}
        <Sphere args={[bodyScale * 0.5, 16, 16]} position={[0, bodyScale * 0.7, bodyScale * 0.35]}>
          <primitive object={faceMat} attach="material" />
        </Sphere>

        {/* 눈 */}
        <Sphere args={[0.06, 8, 8]} position={[-0.12, bodyScale * 0.75, bodyScale * 0.6]}>
          <primitive object={eyeMat} attach="material" />
        </Sphere>
        <Sphere args={[0.06, 8, 8]} position={[0.12, bodyScale * 0.75, bodyScale * 0.6]}>
          <primitive object={eyeMat} attach="material" />
        </Sphere>

        {/* 팔 (좌우 작은 구체) */}
        <Sphere args={[bodyScale * 0.25, 8, 8]} position={[-bodyScale * 0.85, 0, 0]} castShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>
        <Sphere args={[bodyScale * 0.25, 8, 8]} position={[bodyScale * 0.85, 0, 0]} castShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>

        {/* 다리 (좌우 작은 구체) */}
        <Sphere args={[bodyScale * 0.22, 8, 8]} position={[-bodyScale * 0.4, -bodyScale * 0.75, 0]} castShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>
        <Sphere args={[bodyScale * 0.22, 8, 8]} position={[bodyScale * 0.4, -bodyScale * 0.75, 0]} castShadow>
          <primitive object={bodyMat} attach="material" />
        </Sphere>

        {/* ===== 캐릭터별 디테일 ===== */}

        {/* 몬치치: 빨간 턱받이 + 머리 위 머리카락 뭉치 */}
        {type === 'monchhichi' && (
          <>
            <Sphere args={[bodyScale * 0.35, 12, 12]} position={[0, -0.05, bodyScale * 0.35]}>
              <primitive object={accentMat} attach="material" />
            </Sphere>
            <Sphere args={[0.15, 8, 8]} position={[0, bodyScale * 1.35, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Sphere>
          </>
        )}

        {/* 라부부: 뾰족한 토끼 귀 */}
        {type === 'labubu' && (
          <>
            <Cylinder args={[0.04, 0.1, 0.45, 8]} position={[-0.18, bodyScale * 1.4, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Cylinder>
            <Cylinder args={[0.04, 0.1, 0.45, 8]} position={[0.18, bodyScale * 1.4, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Cylinder>
            {/* 이빨 (라부부 특유의 삐뚤 이) */}
            <Box args={[0.15, 0.06, 0.04]} position={[0, bodyScale * 0.55, bodyScale * 0.62]}>
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </Box>
          </>
        )}

        {/* 크라잉베이비: 파란 모자 + 눈물 */}
        {type === 'cryingbaby' && (
          <>
            <Sphere args={[bodyScale * 0.65, 12, 12]} position={[0, bodyScale * 1.1, 0]} castShadow>
              <primitive object={accentMat} attach="material" />
            </Sphere>
            {/* 눈물 */}
            <Sphere args={[0.04, 6, 6]} position={[0.18, bodyScale * 0.65, bodyScale * 0.6]}>
              <meshStandardMaterial color="#87CEEB" roughness={0.1} metalness={0.3} transparent opacity={0.8} />
            </Sphere>
          </>
        )}

        {/* 먼작귀(랏코): 둥글둥글한 크림색 공 + 작은 귀 */}
        {type === 'rakko' && (
          <>
            <Sphere args={[0.08, 8, 8]} position={[-0.3, bodyScale * 1, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Sphere>
            <Sphere args={[0.08, 8, 8]} position={[0.3, bodyScale * 1, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Sphere>
            {/* 볼터치 */}
            <Sphere args={[0.08, 8, 8]} position={[-0.25, bodyScale * 0.65, bodyScale * 0.55]}>
              <meshStandardMaterial color="#FFB6C1" roughness={0.9} />
            </Sphere>
            <Sphere args={[0.08, 8, 8]} position={[0.25, bodyScale * 0.65, bodyScale * 0.55]}>
              <meshStandardMaterial color="#FFB6C1" roughness={0.9} />
            </Sphere>
          </>
        )}

        {/* 하치와레: 고양이 귀 (파란색 + 흰색) + 리본 */}
        {type === 'hachiware' && (
          <>
            {/* 삼각형 귀 (왼쪽 파랑) */}
            <Cylinder args={[0, 0.15, 0.3, 3]} position={[-0.22, bodyScale * 1.3, 0]} castShadow>
              <primitive object={accentMat} attach="material" />
            </Cylinder>
            {/* 삼각형 귀 (오른쪽 흰색) */}
            <Cylinder args={[0, 0.15, 0.3, 3]} position={[0.22, bodyScale * 1.3, 0]} castShadow>
              <primitive object={bodyMat} attach="material" />
            </Cylinder>
            {/* 꼬리 */}
            <Sphere args={[0.1, 8, 8]} position={[0.2, -bodyScale * 0.5, -bodyScale * 0.5]}>
              <primitive object={accentMat} attach="material" />
            </Sphere>
            {/* 볼터치 */}
            <Sphere args={[0.07, 8, 8]} position={[-0.22, bodyScale * 0.6, bodyScale * 0.58]}>
              <meshStandardMaterial color="#FFB6C1" roughness={0.9} />
            </Sphere>
            <Sphere args={[0.07, 8, 8]} position={[0.22, bodyScale * 0.6, bodyScale * 0.58]}>
              <meshStandardMaterial color="#FFB6C1" roughness={0.9} />
            </Sphere>
          </>
        )}

        {/* 한교동: 물고기 지느러미 귀 + 두꺼운 입 */}
        {type === 'hangyodon' && (
          <>
            {/* 옆 지느러미 (좌우) */}
            <Cylinder args={[0.03, 0.12, 0.2, 6]} position={[-bodyScale * 0.75, bodyScale * 0.75, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
              <primitive object={accentMat} attach="material" />
            </Cylinder>
            <Cylinder args={[0.03, 0.12, 0.2, 6]} position={[bodyScale * 0.75, bodyScale * 0.75, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
              <primitive object={accentMat} attach="material" />
            </Cylinder>
            {/* 넓은 입 */}
            <Box args={[0.35, 0.08, 0.06]} position={[0, bodyScale * 0.5, bodyScale * 0.6]}>
              <primitive object={accentMat} attach="material" />
            </Box>
            {/* 머리 위 뿔/더듬이 */}
            <Sphere args={[0.08, 8, 8]} position={[0, bodyScale * 1.35, 0]}>
              <primitive object={accentMat} attach="material" />
            </Sphere>
          </>
        )}
      </group>
    </RigidBody>
  );
};

/**
 * 전체 인형 배치 컴포넌트
 * - 6종 캐릭터를 가챠 기계 안에 무작위로 24개 배치
 */
export const Dolls = () => {
  const characters: CharacterType[] = ['monchhichi', 'labubu', 'cryingbaby', 'rakko', 'hachiware', 'hangyodon'];
  
  // 무작위 인형 목록 (useMemo로 재렌더링 시 위치 고정)
  const dolls = useMemo(() => 
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      type: characters[i % characters.length], // 균등 분배
      position: [
        (Math.random() - 0.5) * 3.5,           // X: 기계 폭 내
        2.5 + Math.random() * 3,               // Y: 바닥 위 공중에서 시작 (떨어지며 자연스럽게 쌓임)
        (Math.random() - 0.5) * 3.5,           // Z: 기계 깊이 내
      ] as [number, number, number],
    }))
  , []);

  return (
    <>
      {dolls.map((doll) => (
        <Doll key={doll.id} type={doll.type} position={doll.position} />
      ))}
    </>
  );
};
