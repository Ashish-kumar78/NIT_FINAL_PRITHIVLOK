import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture, Sphere, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Leaf, Zap, Activity, Lightbulb } from 'lucide-react';

const getPosFromLatLon = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
};

// Reusable color interpolation helper
const lerpColor = (startHex, endHex, factor) => {
  return new THREE.Color().lerpColors(new THREE.Color(startHex), new THREE.Color(endHex), factor);
};

// ---------------------------------------------------------
// Bright Glowing Stars + Nebula Background
// ---------------------------------------------------------
const CosmicBackground = () => {
  const starsRef = useRef();
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Super bright primary stars */}
      <Stars radius={50} depth={50} count={2000} factor={6} saturation={1} fade speed={1.5} />
      {/* Distant background stars */}
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0.5} fade speed={0.5} />
      
      {/* Nebula glowing orbs far behind */}
      <group ref={starsRef}>
         <mesh position={[-20, 10, -30]}>
            <sphereGeometry args={[15, 32, 32]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>
         <mesh position={[25, -15, -40]}>
            <sphereGeometry args={[20, 32, 32]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>
         <mesh position={[5, 20, -25]}>
            <sphereGeometry args={[10, 32, 32]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>
      </group>
    </group>
  );
};

// ---------------------------------------------------------
// 3D Raised Forest Clusters (Stylized & Edgy)
// ---------------------------------------------------------
const ForestCluster = ({ lat, lon, radius, density = 6 }) => {
  const pos = useMemo(() => getPosFromLatLon(lat, lon, radius), [lat, lon, radius]);
  
  // Clean, aesthetic low-poly grouping
  const trees = useMemo(() => {
    const arr = [];
    arr.push({ x: 0, y: 0, size: 0.1 }); // Center prominent tree
    for(let i=0; i<density; i++) {
       const angle = (i / density) * Math.PI * 2;
       const rad = 0.18;
       arr.push({
         x: Math.cos(angle) * rad,
         y: Math.sin(angle) * rad,
         size: 0.07 // slightly smaller surrounding trees
       });
    }
    return arr;
  }, [density]);

  return (
    <group position={pos} onUpdate={(self) => self.lookAt(0,0,0)}>
      {trees.map((t, i) => (
         <group key={i} position={[t.x, t.y, 0]}>
            {/* Edgy low-poly tree (Tetrahedron) pushed outward */}
            <mesh position={[0, 0, -t.size/2]} rotation={[Math.PI/4, Math.PI/4, 0]}>
               <tetrahedronGeometry args={[t.size, 0]} />
               <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.1} emissive="#4ade80" emissiveIntensity={0.8} />
            </mesh>
            {/* Glowing base to merge seamlessly with the Earth's surface */}
            <mesh position={[0, 0, -0.01]}>
               <circleGeometry args={[t.size * 1.5, 16]} />
               <meshBasicMaterial color="#22c55e" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
         </group>
      ))}
    </group>
  );
};

// ---------------------------------------------------------
// Bio Particles
// ---------------------------------------------------------
const BioParticles = ({ energyFactor }) => {
  const pointsRef = useRef();
  
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.03;
    }
  });
  
  const positions = useMemo(() => {
    const pos = [];
    for(let i=0; i<400; i++) {
      const lat = (Math.random() - 0.5) * 180;
      const lon = (Math.random() - 0.5) * 360;
      const vec = getPosFromLatLon(lat, lon, 2.5 + Math.random() * 0.15); 
      pos.push(vec.x, vec.y, vec.z);
    }
    return new Float32Array(pos);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4ade80" transparent opacity={0.6 * energyFactor} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// ---------------------------------------------------------
// Heartbeat Segmented Ring
// ---------------------------------------------------------
const SegmentedRing = ({ radius, color, speed, arc, rotation, pulse = false, type = 'normal' }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z += speed;
      
      if (pulse) {
        const t = clock.getElapsedTime();
        const beat = Math.pow(Math.sin(t * Math.PI * 1.5), 16) + Math.pow(Math.sin((t + 0.2) * Math.PI * 1.5), 16);
        const scale = 1 + beat * 0.04;
        ref.current.scale.set(scale, scale, scale);
      }
      
      if (type === 'carbon') {
          ref.current.position.x = (Math.random() - 0.5) * 0.02;
          ref.current.position.y = (Math.random() - 0.5) * 0.02;
      }
    }
  });

  return (
    <group rotation={rotation} ref={ref}>
      <Torus args={[radius, 0.015, 16, 128, arc]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus args={[radius, 0.05, 16, 128, arc]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Torus>
    </group>
  );
};

const OrbitalRingsAndHUD = () => {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; 
      groupRef.current.rotation.z -= 0.0005;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.15]}>
      <SegmentedRing radius={3.2} color="#22c55e" speed={0.003} arc={Math.PI * 1.3} rotation={[0,0,0]} pulse={true} />
      <SegmentedRing radius={3.25} color="#4ade80" speed={-0.004} arc={Math.PI * 0.5} rotation={[0,0,Math.PI]} pulse={true} />
      <SegmentedRing radius={3.45} color="#0ea5e9" speed={0.005} arc={Math.PI * 1.8} rotation={[0.05, 0, 0]} />
      <SegmentedRing radius={3.7} color="#ef4444" speed={-0.002} arc={Math.PI * 0.8} rotation={[-0.05, 0, 0]} type="carbon" />
      <SegmentedRing radius={3.75} color="#f97316" speed={0.006} arc={Math.PI * 0.4} rotation={[-0.05, 0, Math.PI / 2]} />
    </group>
  );
};

// ---------------------------------------------------------
// Holographic Floating Icons
// ---------------------------------------------------------
const FloatingIcon = ({ position, Icon, label }) => {
  return (
    <Html position={position} center className="pointer-events-none z-10">
      <div className="flex flex-col items-center justify-center gap-2 group animate-[bounce_4s_infinite]">
        <div className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
          <Icon size={18} className="text-cyan-400 group-hover:text-white" />
        </div>
        <span className="text-[8px] font-bold text-cyan-300 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-full border border-cyan-500/20 backdrop-blur-md">
           {label}
        </span>
      </div>
    </Html>
  );
};

// ---------------------------------------------------------
// Interactive EcoZone Component (Enlarged Windmills & Hubs)
// ---------------------------------------------------------
const EcoZone = ({ lat, lon, radius, type = "wind", name, stats, speed=0.1 }) => {
  const groupRef = useRef();
  const bladesRef = useRef();
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => getPosFromLatLon(lat, lon, radius), [lat, lon, radius]);
  
  useFrame(() => {
    if (bladesRef.current && type === "wind") {
      bladesRef.current.rotation.z += (hovered ? speed * 2 : speed);
    }
  });

  return (
    <group 
      /* Clean, highly visible scaling for story impact */
      position={pos} scale={type === 'hub' ? 0.08 : 0.08} 
      ref={groupRef} onUpdate={(self) => self.lookAt(0,0,0)}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'grab'; }}
    >
      {hovered && (
        <Html position={[0, -2, -2]} center zIndexRange={[100, 0]}>
          <div className="bg-black/90 backdrop-blur-md border border-cyan-500 rounded-lg p-3 shadow-[0_0_20px_rgba(6,182,212,0.5)] pointer-events-none w-48 transition-all duration-300">
             <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-cyan-500/30 pb-1 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> {name}
             </h4>
             <p className="text-[10px] text-cyan-300 mb-1">{stats}</p>
          </div>
        </Html>
      )}

      {hovered && (
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {type === "wind" && (
        <group>
          {/* Pillar - highly reflective and luminous */}
          <mesh position={[0, 0, -1.5]}>
            <cylinderGeometry args={[0.2, 0.4, 3, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.8} />
          </mesh>
          {/* Blades - cleanly glowing white */}
          <group position={[0, 0, -3]} ref={bladesRef}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 0.5, 16]} />
               <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0, 1.8, 0]}><boxGeometry args={[0.15, 3.6, 0.05]} /><meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={hovered ? 2 : 1.2} /></mesh>
            <mesh position={[1.5, -0.9, 0]} rotation={[0, 0, -Math.PI/3 * 2]}><boxGeometry args={[0.15, 3.6, 0.05]} /><meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={hovered ? 2 : 1.2} /></mesh>
            <mesh position={[-1.5, -0.9, 0]} rotation={[0, 0, Math.PI/3 * 2]}><boxGeometry args={[0.15, 3.6, 0.05]} /><meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive="#ffffff" emissiveIntensity={hovered ? 2 : 1.2} /></mesh>
          </group>
        </group>
      )}

      {type === "solar" && (
        <group position={[0,0,-0.5]}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <boxGeometry args={[5, 3, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.0} emissive="#3b82f6" emissiveIntensity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <boxGeometry args={[5.2, 3.2, 0.1]} />
            <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {type === "hub" && (
        <group position={[0, 0, -0.5]}>
          <mesh>
             <sphereGeometry args={[1, 32, 32]} />
             <meshStandardMaterial color="#10b981" emissive="#22c55e" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0,0,0]}>
             <sphereGeometry args={[1.5, 16, 16]} />
             <meshBasicMaterial color="#4ade80" wireframe transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ---------------------------------------------------------
// Earth Model
// ---------------------------------------------------------
const EarthModel = ({ currentYear, energy, carbon }) => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005; 
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0007; 
  });

  // Calculate interpolation factors (0 to 1)
  const carbonFactor = Math.max(0, Math.min(1, (carbon - 335) / 75)); // Higher factor = more carbon
  const energyFactor = Math.max(0, Math.min(1, (energy - 20) / 70));  // Higher factor = more green energy

  return (
    <group ref={earthRef} rotation={[0.3, -0.5, 0]}>
      {/* 1. Base Earth Layer */}
      <Sphere args={[2.5, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.5 + carbonFactor * 0.4} 
          metalness={0.1}
          emissive={new THREE.Color('#10b981')}
          emissiveMap={colorMap}
          emissiveIntensity={energyFactor * 0.4} 
          color={lerpColor('#ffffff', '#a8a29e', carbonFactor)}
        />
      </Sphere>

      {/* 2. Precise Cloud Layer */}
      <Sphere args={[2.52, 64, 64]} ref={cloudsRef}>
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.5 + carbonFactor * 0.4 - energyFactor * 0.2} 
          blending={THREE.NormalBlending}
          depthWrite={false}
          color={lerpColor('#e0f2fe', '#64748b', carbonFactor)} 
        />
      </Sphere>

      {/* 3. Blue/Red Atmospheric Rim Glow */}
      <Sphere args={[2.65, 64, 64]}>
        <meshBasicMaterial
          color={lerpColor('#0ea5e9', '#ef4444', carbonFactor)} 
          transparent={true}
          opacity={0.15 + carbonFactor * 0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Dynamic Evolution of Eco Features Based on Timeline Progress */}
      {energy > 25 && <BioParticles energyFactor={energyFactor} />}
      
      {/* First wave of modern green energy */}
      {energy > 30 && (
        <>
          <EcoZone lat={52.5} lon={5.5} radius={2.5} type="wind" name="North Sea Fleet" stats="Output: 2,500 MW" speed={0.05 + energyFactor * 0.2} />
          <EcoZone lat={30.0} lon={-100} radius={2.5} type="solar" name="Texas Solar Array" stats="Yield: 95% Efficiency" />
          <ForestCluster lat={-3.4} lon={-62} radius={2.5} density={8} />
          <ForestCluster lat={15.0} lon={100} radius={2.5} density={5} /> 
        </>
      )}

      {/* Second wave (Post 2024 equivalent) */}
      {energy > 65 && (
        <>
          <EcoZone lat={40.7} lon={-74} radius={2.5} type="wind" name="Empire Wind" stats="Output: 816 MW" speed={0.1 + energyFactor * 0.2} />
          <EcoZone lat={35.0} lon={139} radius={2.5} type="wind" name="Tokyo Bay Array" stats="Output: 1,200 MW" speed={0.15 + energyFactor * 0.1} />
          <EcoZone lat={48.8} lon={2.3} radius={2.5} type="hub" name="Paris Green Hub" stats="Carbon Negative" />
          <ForestCluster lat={-1.0} lon={20} radius={2.5} density={6} />
        </>
      )}

      {/* Future wave */}
      {energy > 80 && (
        <>
          <EcoZone lat={1.3} lon={103.8} radius={2.5} type="hub" name="Singapore Eco Base" stats="100% Renewable" />
          <EcoZone lat={25.0} lon={45} radius={2.5} type="solar" name="Sahara Solar Hub" stats="Yield: 99% Efficiency" />
          <EcoZone lat={-10} lon={-50} radius={2.5} type="hub" name="Amazon Eco Hub" stats="Nature Synced" />
          <ForestCluster lat={30} lon={0} radius={2.5} density={8} />  
        </>
      )}
      
      <OrbitalRingsAndHUD />

      <FloatingIcon position={getPosFromLatLon(25, -50, 3.8)} Icon={Leaf} label="Sustainability" />
      <FloatingIcon position={getPosFromLatLon(45, 60, 4.0)} Icon={Zap} label="Energy" />
      <FloatingIcon position={getPosFromLatLon(-25, 100, 3.7)} Icon={Lightbulb} label="Innovation" />
      <FloatingIcon position={getPosFromLatLon(-40, -100, 3.9)} Icon={Activity} label="Ecosystem" />
    </group>
  );
};

export default function Earth3D({ currentYear = 2024, energy = 72, carbon = 410 }) {
  const carbonFactor = Math.max(0, Math.min(1, (carbon - 335) / 75));
  const energyFactor = Math.max(0, Math.min(1, (energy - 20) / 70));

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} style={{ zIndex: 0 }}>
        
        <CosmicBackground />

        {/* Dynamic environmental lighting directly interpolating with carbon & energy scales */}
        <ambientLight 
          intensity={0.15 + energyFactor * 0.15} 
          color={lerpColor('#ef4444', '#ffffff', 1 - carbonFactor)} 
        />
        
        {/* Extreme cinematic directional sun-lighting */}
        <directionalLight 
          position={[12, 3, 5]} 
          intensity={1.5 + energyFactor * 2.5} 
          color="#ffffff" 
          castShadow 
        />
        
        {/* Responsive Atmospheric Ring Lighting */}
        <pointLight 
          position={[-10, 5, -5]} 
          intensity={0.5 + carbonFactor + energyFactor} 
          color={lerpColor('#22c55e', '#ef4444', carbonFactor)} 
        />
        <pointLight 
          position={[-10, -5, -5]} 
          intensity={0.5 + carbonFactor} 
          color={lerpColor('#0ea5e9', '#f97316', carbonFactor)} 
        />
        
        <Suspense fallback={
          <Html center>
            <div className="text-cyan-400 font-bold tracking-widest text-[10px] animate-pulse uppercase border border-cyan-500/30 bg-black/50 p-3 rounded-lg backdrop-blur-md">
               Initializing Cinematic Planet System...</div>
          </Html>
        }>
          <EarthModel currentYear={currentYear} energy={energy} carbon={carbon} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} minDistance={4} maxDistance={15} enablePan={false} 
          rotateSpeed={0.8} autoRotate={true} autoRotateSpeed={0.5} enableDamping={true} dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
