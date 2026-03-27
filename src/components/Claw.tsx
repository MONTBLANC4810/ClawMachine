import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Box, Cylinder } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

/**
 * 인형뽑기 집게(Claw) 컴포넌트
 * - 키네마틱 바디를 이용해 매 프레임 Zustand 스토어의 위치값을 따라가도록 보간
 * - 3개의 손가락이 isGrabbing 상태에 따라 오므라들거나 벌어짐
 */
export const Claw = () => {
  const { clawPosition, isGrabbing } = useGameStore();
  
  // 물리 엔진 RigidBody 참조
  const baseRef = useRef<RapierRigidBody>(null);
  const finger1Ref = useRef<RapierRigidBody>(null);
  const finger2Ref = useRef<RapierRigidBody>(null);
  const finger3Ref = useRef<RapierRigidBody>(null);

  const tempPos = new THREE.Vector3();
  const BASE_H = 1.2; // 받침대 높이 보정

  useFrame((_, delta) => {
    const targetX = clawPosition[0];
    const targetY = clawPosition[1] + BASE_H;
    const targetZ = clawPosition[2];

    if (baseRef.current && finger1Ref.current && finger2Ref.current && finger3Ref.current) {
      // 1. 베이스 이동 (부드러운 보간)
      const currentPos = baseRef.current.translation();
      tempPos.set(currentPos.x, currentPos.y, currentPos.z);
      tempPos.lerp(new THREE.Vector3(targetX, targetY, targetZ), 5 * delta);
      baseRef.current.setNextKinematicTranslation(tempPos);

      // 2. 손가락 열고 닫기 (isGrabbing에 따라 회전각 변경)
      const grabAngle = isGrabbing ? -Math.PI / 16 : Math.PI / 5;
      const fingerY = tempPos.y - 0.5;
      const fingerSpread = 0.35;

      // 손가락 1 (정면)
      const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(grabAngle, 0, 0));
      finger1Ref.current.setNextKinematicTranslation(new THREE.Vector3(tempPos.x, fingerY, tempPos.z + fingerSpread));
      finger1Ref.current.setNextKinematicRotation(q1);

      // 손가락 2 (왼쪽 뒤)
      const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(grabAngle, (Math.PI * 2) / 3, 0));
      finger2Ref.current.setNextKinematicTranslation(new THREE.Vector3(
        tempPos.x + Math.sin((Math.PI * 2) / 3) * fingerSpread,
        fingerY,
        tempPos.z + Math.cos((Math.PI * 2) / 3) * fingerSpread
      ));
      finger2Ref.current.setNextKinematicRotation(q2);

      // 손가락 3 (오른쪽 뒤)
      const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(grabAngle, -(Math.PI * 2) / 3, 0));
      finger3Ref.current.setNextKinematicTranslation(new THREE.Vector3(
        tempPos.x + Math.sin(-(Math.PI * 2) / 3) * fingerSpread,
        fingerY,
        tempPos.z + Math.cos(-(Math.PI * 2) / 3) * fingerSpread
      ));
      finger3Ref.current.setNextKinematicRotation(q3);
    }
  });

  // 손가락 하나의 메쉬 (재사용)
  const FingerMesh = () => (
    <group>
      {/* 손가락 막대 부분 */}
      <Box args={[0.06, 1.0, 0.06]} position={[0, -0.5, 0]} castShadow>
        <meshStandardMaterial color="#d4d4d4" metalness={0.95} roughness={0.1} />
      </Box>
      {/* 손가락 끝 갈고리 부분 */}
      <Box args={[0.06, 0.06, 0.25]} position={[0, -1.0, -0.1]} castShadow>
        <meshStandardMaterial color="#e74c3c" metalness={0.7} roughness={0.2} />
      </Box>
    </group>
  );

  return (
    <>
      {/* 집게 베이스 (모터 헤드) */}
      <RigidBody ref={baseRef} type="kinematicPosition" position={[0, 5.2, 0]} colliders="hull" friction={1}>
        {/* 모터 몸체 (실린더) */}
        <Cylinder args={[0.3, 0.35, 0.6, 16]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.15} />
        </Cylinder>
        {/* 상단 볼트 장식 */}
        <Cylinder args={[0.15, 0.15, 0.1, 8]} position={[0, 0.35, 0]}>
          <meshStandardMaterial color="#666666" metalness={0.95} roughness={0.1} />
        </Cylinder>
        {/* 케이블 (레일까지 올라가는 와이어) */}
        <Cylinder args={[0.015, 0.015, 8]} position={[0, 4, 0]}>
          <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
        </Cylinder>
      </RigidBody>

      {/* 손가락 1 */}
      <RigidBody ref={finger1Ref} type="kinematicPosition" colliders="hull" friction={8}>
        <FingerMesh />
      </RigidBody>

      {/* 손가락 2 */}
      <RigidBody ref={finger2Ref} type="kinematicPosition" colliders="hull" friction={8}>
        <FingerMesh />
      </RigidBody>

      {/* 손가락 3 */}
      <RigidBody ref={finger3Ref} type="kinematicPosition" colliders="hull" friction={8}>
        <FingerMesh />
      </RigidBody>
    </>
  );
};
