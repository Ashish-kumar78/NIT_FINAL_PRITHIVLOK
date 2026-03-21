import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function Scene() {
  return (
    <Float speed={2} rotationIntensity={1}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00ffcc" wireframe />
      </mesh>
    </Float>
  );
}

export default function Background3D() {
  return (
    <Canvas style={{ position: "fixed", top: 0, zIndex: -1 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Scene />
    </Canvas>
  );
}
