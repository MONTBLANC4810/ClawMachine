
import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';

export const Machine = () => {
  return (
    <group>
      {/* 바닥 (사방을 막아주는 바닥) */}
      <RigidBody type="fixed" friction={1}>
        {/* 전체 바닥 중에서 드롭존(구멍)을 파놓은 구조를 만듭니다 */}
        {/* 단순화를 위해 벽과 경사진 바닥으로 상품이 구멍으로 흘러가도록 구성합니다. */}
        
        {/* 메인 바닥 */}
        <Box args={[6, 0.2, 5]} position={[0, 0, -1]} castShadow receiveShadow>
          <meshStandardMaterial color="#eeeeee" />
        </Box>
        {/* 오른쪽 바닥 */}
        <Box args={[2.5, 0.2, 2.5]} position={[1.75, 0, 2.75]} castShadow receiveShadow>
          <meshStandardMaterial color="#eeeeee" />
        </Box>
        {/* 뒷쪽 바닥 */}
        <Box args={[6, 0.2, 2.5]} position={[0, 0, -3.25]} castShadow receiveShadow>
          <meshStandardMaterial color="#eeeeee" />
        </Box>
      </RigidBody>

      {/* 투명한 유리벽 */}
      <RigidBody type="fixed" friction={0}>
        {/* 좌측 벽 */}
        <Box args={[0.1, 8, 8]} position={[-3, 4, 0]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0} />
        </Box>
        {/* 우측 벽 */}
        <Box args={[0.1, 8, 8]} position={[3, 4, 0]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0} />
        </Box>
        {/* 뒤쪽 벽 */}
        <Box args={[6, 8, 0.1]} position={[0, 4, -4]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0} />
        </Box>
        {/* 앞쪽 벽 */}
        <Box args={[6, 8, 0.1]} position={[0, 4, 4]}>
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0} />
        </Box>
      </RigidBody>

      {/* 배출구(Drop Zone) 프레임 */}
      <group position={[-1.5, 0.1, 2.75]}>
        <Box args={[2.5, 0.2, 2.5]}>
          <meshStandardMaterial color="#ff4a4a" wireframe />
        </Box>
      </group>
    </group>
  );
};
