import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Box, Cylinder } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

export const Claw = () => {
  const { clawPosition, isGrabbing } = useGameStore();
  
  // 메인 집게 몸체 Ref (키네마틱 바디: 코드 상의 위치를 물리엔진에 반영)
  const baseRef = useRef<RapierRigidBody>(null);
  
  // 집게 손가락 3개의 Ref
  const finger1Ref = useRef<RapierRigidBody>(null);
  const finger2Ref = useRef<RapierRigidBody>(null);
  const finger3Ref = useRef<RapierRigidBody>(null);

  // 부드러운 이동을 위한 임시 벡터
  const tempPos = new THREE.Vector3();

  // 매 프레임마다 집게의 위치와 벌어짐 상태 업데이트
  useFrame((_, delta) => {
    // 목표 위치: zustand store 값
    const targetX = clawPosition[0];
    const targetY = clawPosition[1];
    const targetZ = clawPosition[2];

    if (baseRef.current && finger1Ref.current && finger2Ref.current && finger3Ref.current) {
      // 1. 메인 몸체 이동 (보간)
      const currentPos = baseRef.current.translation();
      tempPos.set(currentPos.x, currentPos.y, currentPos.z);
      tempPos.lerp(new THREE.Vector3(targetX, targetY, targetZ), 5 * delta);
      baseRef.current.setNextKinematicTranslation(tempPos);

      // 2. 집게 손가락 열고 닫는 각도 설정
      // isGrabbing 이 true 이면 오므림(0에 가깝게), false면 벌림
      const targetAngle = isGrabbing ? -Math.PI / 12 : Math.PI / 4; // 오므림 각도, 벌림 각도

      // 1번 손가락 (Z축 기준)
      const curRot1 = finger1Ref.current.rotation();
      const targetQuat1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetAngle, 0, 0));
      const q1 = new THREE.Quaternion(curRot1.x, curRot1.y, curRot1.z, curRot1.w).slerp(targetQuat1, 10 * delta);
      finger1Ref.current.setNextKinematicTranslation(new THREE.Vector3(tempPos.x, tempPos.y - 0.4, tempPos.z + 0.3));
      finger1Ref.current.setNextKinematicRotation(q1);

      // 2번 손가락 (120도 회전)
      const curRot2 = finger2Ref.current.rotation();
      const targetQuat2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetAngle, 0, 0)).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI * 2) / 3));
      const q2 = new THREE.Quaternion(curRot2.x, curRot2.y, curRot2.z, curRot2.w).slerp(targetQuat2, 10 * delta);
      finger2Ref.current.setNextKinematicTranslation(new THREE.Vector3(
        tempPos.x + Math.sin((Math.PI * 2) / 3) * 0.3,
        tempPos.y - 0.4,
        tempPos.z + Math.cos((Math.PI * 2) / 3) * 0.3
      ));
      finger2Ref.current.setNextKinematicRotation(q2);

      // 3번 손가락 (240도 회전)
      const curRot3 = finger3Ref.current.rotation();
      const targetQuat3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetAngle, 0, 0)).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -(Math.PI * 2) / 3));
      const q3 = new THREE.Quaternion(curRot3.x, curRot3.y, curRot3.z, curRot3.w).slerp(targetQuat3, 10 * delta);
      finger3Ref.current.setNextKinematicTranslation(new THREE.Vector3(
        tempPos.x + Math.sin(-(Math.PI * 2) / 3) * 0.3,
        tempPos.y - 0.4,
        tempPos.z + Math.cos(-(Math.PI * 2) / 3) * 0.3
      ));
      finger3Ref.current.setNextKinematicRotation(q3);
    }
  });

  return (
    <>
      {/* 집게 베이스 머리 부분 */}
      <RigidBody ref={baseRef} type="kinematicPosition" position={[0, 4, 0]} colliders="hull" friction={1}>
        <Cylinder args={[0.3, 0.4, 0.5, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#eeeeee" metalness={0.8} />
        </Cylinder>
        {/* 줄 (상단으로 이어지는 쇠사슬이나 케이블 가짜 표현) */}
        <Cylinder args={[0.02, 0.02, 10]} position={[0, 5, 0]}>
          <meshStandardMaterial color="#444444" />
        </Cylinder>
      </RigidBody>

      {/* 손가락 1 */}
      <RigidBody ref={finger1Ref} type="kinematicPosition" colliders="hull" friction={10}>
        <Box args={[0.1, 1.2, 0.1]} position={[0, -0.6, 0.1]}>
          <meshStandardMaterial color="#cccccc" metalness={1} />
        </Box>
        {/* 손가락 끝 꺾임 부위 */}
        <Box args={[0.1, 0.1, 0.4]} position={[0, -1.2, -0.05]}>
          <meshStandardMaterial color="#aa0000" />
        </Box>
      </RigidBody>

      {/* 손가락 2 */}
      <RigidBody ref={finger2Ref} type="kinematicPosition" colliders="hull" friction={10}>
        <Box args={[0.1, 1.2, 0.1]} position={[0, -0.6, 0.1]}>
          <meshStandardMaterial color="#cccccc" metalness={1} />
        </Box>
        <Box args={[0.1, 0.1, 0.4]} position={[0, -1.2, -0.05]}>
          <meshStandardMaterial color="#aa0000" />
        </Box>
      </RigidBody>

      {/* 손가락 3 */}
      <RigidBody ref={finger3Ref} type="kinematicPosition" colliders="hull" friction={10}>
        <Box args={[0.1, 1.2, 0.1]} position={[0, -0.6, 0.1]}>
          <meshStandardMaterial color="#cccccc" metalness={1} />
        </Box>
        <Box args={[0.1, 0.1, 0.4]} position={[0, -1.2, -0.05]}>
          <meshStandardMaterial color="#aa0000" />
        </Box>
      </RigidBody>
    </>
  );
};
