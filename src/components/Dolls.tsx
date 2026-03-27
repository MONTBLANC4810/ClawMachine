
import { RigidBody } from '@react-three/rapier';
import { Capsule, Sphere, Box } from '@react-three/drei';

const characterColors = {
  monchhichi: '#8B5A2B', // Brown
  labubu: '#6B5B53', // Dark Grayish Brown
  cryingbaby: '#FFB6C1', // Light Pink
  rakko: '#F5DEB3', // Wheat/Beige
  hachiware: '#87CEFA', // Light Blue / White
  hangyodon: '#48D1CC' // Turquoise Blue
};

// 인형들을 생성하는 팩토리 함수 (간소화된 3D 메쉬 조합)
const Doll = ({ type, position }: { type: keyof typeof characterColors, position: [number, number, number] }) => {
  const color = characterColors[type];

  return (
    <RigidBody colliders="hull" position={position} mass={1} friction={0.8} restitution={0.1}>
      <group>
        {/* 기본 몸통 (캡슐) */}
        <Capsule args={[0.4, 0.6]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.9} />
        </Capsule>
        
        {/* 머리에 귀 모양이나 추가 데코레이션 부착 */}
        {type === 'labubu' && (
          <>
            {/* 토끼 귀 */}
            <Box args={[0.15, 0.5, 0.1]} position={[-0.2, 0.8, 0]} castShadow>
              <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.15, 0.5, 0.1]} position={[0.2, 0.8, 0]} castShadow>
              <meshStandardMaterial color={color} />
            </Box>
          </>
        )}
        
        {type === 'hachiware' && (
          <>
            {/* 고양이 귀 */}
            <Sphere args={[0.15]} position={[-0.25, 0.6, 0]} castShadow>
              <meshStandardMaterial color="#4682B4" />
            </Sphere>
            <Sphere args={[0.15]} position={[0.25, 0.6, 0]} castShadow>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
          </>
        )}

        {/* 눈 (공통) */}
        <Sphere args={[0.06]} position={[-0.15, 0.3, 0.35]}>
          <meshStandardMaterial color="#000" />
        </Sphere>
        <Sphere args={[0.06]} position={[0.15, 0.3, 0.35]}>
          <meshStandardMaterial color="#000" />
        </Sphere>
      </group>
    </RigidBody>
  );
};

export const Dolls = () => {
  // 인형 무작위 더미 생성
  const characters = ['monchhichi', 'labubu', 'cryingbaby', 'rakko', 'hachiware', 'hangyodon'] as const;
  
  const dolls = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    type: characters[Math.floor(Math.random() * characters.length)],
    position: [
      (Math.random() - 0.5) * 4,
      Math.random() * 3 + 1,
      (Math.random() - 0.5) * 4 - 1
    ] as [number, number, number]
  }));

  return (
    <>
      {dolls.map((doll) => (
        <Doll key={doll.id} type={doll.type} position={doll.position} />
      ))}
    </>
  );
};
