'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArtifactItem, ArtifactHotspot } from './artifact-data';

interface ArtifactViewer3DProps {
  artifact: ArtifactItem;
  lightingMode: 'dungeon' | 'museum' | 'freedom';
  isXRay: boolean;
  isAutoRotate: boolean;
  zoomLevel: number; // 0.8 to 2.2
  onSelectHotspot?: (hotspot: ArtifactHotspot) => void;
  selectedHotspotId?: string | null;
  onZoomChange?: (newZoom: number) => void;
}

interface ProjectedHotspot {
  hotspot: ArtifactHotspot;
  screenX: number; // percentage 0-100
  screenY: number; // percentage 0-100
  visible: boolean;
}

export function ArtifactViewer3D({
  artifact,
  lightingMode,
  isXRay,
  isAutoRotate,
  zoomLevel,
  onSelectHotspot,
  selectedHotspotId,
  onZoomChange,
}: ArtifactViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic props kept in refs to avoid stale closures in animation render loop
  const zoomRef = useRef(zoomLevel);
  zoomRef.current = zoomLevel;

  const autoRotateRef = useRef(isAutoRotate);
  autoRotateRef.current = isAutoRotate;

  const xRayRef = useRef(isXRay);
  xRayRef.current = isXRay;

  const lightingModeRef = useRef(lightingMode);
  lightingModeRef.current = lightingMode;

  const artifactRef = useRef(artifact);
  artifactRef.current = artifact;

  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;

  // Projection state for 2D hotspot overlays on top of 3D canvas
  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Lights refs for dynamic updates
  const keyLightRef = useRef<THREE.SpotLight | null>(null);
  const fillLightRef = useRef<THREE.PointLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // 3D Flashlight System refs
  const flashSpotRef = useRef<THREE.SpotLight | null>(null);
  const flashBulbRef = useRef<THREE.PointLight | null>(null);
  const flashTargetRef = useRef<THREE.Object3D | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseCoordsRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const flashLerpTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [flashlightPixelPos, setFlashlightPixelPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Exploded / animated parts refs
  const explodedPartsRef = useRef<{ mesh: THREE.Object3D; origin: THREE.Vector3; targetOffset: THREE.Vector3; originRot?: THREE.Euler; targetRot?: THREE.Euler }[]>([]);

  // Physics & Inertia rotation state
  const rotStateRef = useRef({
    targetY: 0,
    targetX: 0,
    currentY: 0,
    currentX: 0,
    velY: 0,
    velX: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastInteractionTime: Date.now(),
  });

  // Sound effect generator using Web Audio API (0 VND)
  const playChimeSound = useCallback((frequency = 880, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext policy suppression fallback
    }
  }, []);

  // =========================================================================
  // MODEL BUILDERS PROCEDURAL 3D
  // =========================================================================
  const buildArtifactGeometry = useCallback((item: ArtifactItem, xRay: boolean): THREE.Group => {
    const root = new THREE.Group();
    explodedPartsRef.current = [];

    // Base Material creator
    const createMat = (options: {
      color?: number;
      roughness?: number;
      metalness?: number;
      clearcoat?: number;
      bumpScale?: number;
      wireframe?: boolean;
    }) => {
      if (xRay) {
        return new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          wireframe: true,
          emissive: 0x003344,
          roughness: 0.2,
          metalness: 0.9,
          transparent: true,
          opacity: 0.85,
        });
      }

      return new THREE.MeshPhysicalMaterial({
        color: options.color ?? 0xc8d1d8,
        roughness: options.roughness ?? 0.35,
        metalness: options.metalness ?? 0.85,
        clearcoat: options.clearcoat ?? 0.3,
        clearcoatRoughness: 0.15,
        reflectivity: 0.8,
      });
    };

    if (item.id === 'chiec-luoc-nhom') {
      // 1. CHIẾC LƯỢC NHÔM KHẮC CHIM BỒ CÂU (TRENCH ART COMB)
      const spineMat = createMat({ color: 0xeef4fa, roughness: 0.22, metalness: 0.92, clearcoat: 0.85 });
      const toothMat = createMat({ color: 0xdae2ea, roughness: 0.28, metalness: 0.88 });
      const doveMat = createMat({ color: 0xffffff, roughness: 0.12, metalness: 0.98 });

      // Seamless Arched Spine Shape
      const spineShape = new THREE.Shape();
      spineShape.moveTo(-1.55, 0.12);
      spineShape.lineTo(1.55, 0.12);
      spineShape.quadraticCurveTo(1.66, 0.12, 1.68, 0.22);
      spineShape.lineTo(1.68, 0.38);
      spineShape.quadraticCurveTo(1.64, 0.52, 1.46, 0.56);
      // Sweeping arched crest
      spineShape.bezierCurveTo(0.72, 0.74, -0.72, 0.74, -1.46, 0.56);
      spineShape.quadraticCurveTo(-1.64, 0.52, -1.68, 0.38);
      spineShape.lineTo(-1.68, 0.22);
      spineShape.quadraticCurveTo(-1.66, 0.12, -1.55, 0.12);

      const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
        depth: 0.065,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.014,
        bevelThickness: 0.014,
      });
      spineGeo.translate(0, 0, -0.0325);
      const spineMesh = new THREE.Mesh(spineGeo, spineMat);
      root.add(spineMesh);

      // 28 Seamless Teeth (Anchored deeply inside the spine, ZERO GAP)
      const teethGroup = new THREE.Group();
      const count = 28;
      const startX = -1.42;
      const span = 2.84;
      const gap = span / (count - 1);

      for (let i = 0; i < count; i++) {
        const x = startX + i * gap;
        const distFromCenter = Math.abs(x) / 1.42;
        const bottomY = -0.74 + distFromCenter * 0.16;
        const topY = 0.18; // Embedded 0.06 inside spine base (0.12)
        const height = topY - bottomY;
        const isEdge = i === 0 || i === count - 1;
        const width = isEdge ? 0.082 : 0.052;

        // Main tooth blade
        const shaftGeo = new THREE.BoxGeometry(width, height - 0.03, 0.054);
        const shaft = new THREE.Mesh(shaftGeo, toothMat);
        shaft.position.set(x, (topY + bottomY + 0.03) / 2, 0);
        teethGroup.add(shaft);

        // Rounded ergonomic tooth tip at bottom
        const tipGeo = new THREE.CylinderGeometry(width / 2, 0.01, 0.035, 12);
        const tip = new THREE.Mesh(tipGeo, toothMat);
        tip.position.set(x, bottomY + 0.018, 0);
        teethGroup.add(tip);
      }
      root.add(teethGroup);

      // Hand-scratched Nail Inscriptions by Political Prisoner (Nét khắc đinh chìm thủ công của người tù)
      const engravingGroup = new THREE.Group();
      const scratchMat = new THREE.MeshStandardMaterial({
        color: 0x334155, // Màu xám đen oxit kim loại đọng lại trong rãnh khắc
        roughness: 0.7,
        metalness: 0.6,
      });

      // Helper function to create fine scratched lines (đoạn rãnh khắc mảnh)
      const addScratchLine = (p1: [number, number], p2: [number, number], radius = 0.0055) => {
        const curve = new THREE.LineCurve3(
          new THREE.Vector3(p1[0], p1[1], 0.0335),
          new THREE.Vector3(p2[0], p2[1], 0.0335)
        );
        const geo = new THREE.TubeGeometry(curve, 2, radius, 4, false);
        const mesh = new THREE.Mesh(geo, scratchMat);
        engravingGroup.add(mesh);
      };

      // 1. Nét khắc hình chim bồ câu hòa bình (Minimalist Hand-scratched Peace Dove Outline)
      // Mỏ chim & đầu
      addScratchLine([0.22, 0.40], [0.30, 0.44]);
      addScratchLine([0.30, 0.44], [0.38, 0.42]);
      // Cánh vươn lên
      addScratchLine([0.38, 0.42], [0.50, 0.56]);
      addScratchLine([0.50, 0.56], [0.62, 0.48]);
      addScratchLine([0.62, 0.48], [0.46, 0.40]);
      // Các nét vạch lông cánh khắc đinh
      addScratchLine([0.44, 0.46], [0.53, 0.51]);
      addScratchLine([0.48, 0.44], [0.57, 0.48]);
      // Lưng và đuôi xòe quạt
      addScratchLine([0.46, 0.40], [0.68, 0.36]);
      addScratchLine([0.68, 0.36], [0.62, 0.31]);
      addScratchLine([0.62, 0.31], [0.69, 0.27]);
      // Bụng và ngực khép kín về mỏ
      addScratchLine([0.69, 0.27], [0.46, 0.31]);
      addScratchLine([0.46, 0.31], [0.30, 0.34]);
      addScratchLine([0.30, 0.34], [0.22, 0.40]);
      // Mắt chim (một chấm đinh gõ chìm)
      const eyeGeo = new THREE.SphereGeometry(0.008, 6, 6);
      const eyeMesh = new THREE.Mesh(eyeGeo, scratchMat);
      eyeMesh.position.set(0.28, 0.41, 0.0335);
      engravingGroup.add(eyeMesh);
      // Cành lá hòa bình ngậm ở mỏ (3 nét gạch đinh mộc mạc)
      addScratchLine([0.22, 0.40], [0.12, 0.43]);
      addScratchLine([0.16, 0.42], [0.15, 0.47]);
      addScratchLine([0.12, 0.43], [0.08, 0.45]);

      // 2. Dòng chữ khắc chìm mộc mạc của người tù: "1963 • TỰ DO"
      // Số 1
      addScratchLine([-0.95, 0.30], [-0.95, 0.44]);
      addScratchLine([-0.98, 0.41], [-0.95, 0.44]);
      // Số 9
      addScratchLine([-0.88, 0.37], [-0.82, 0.37]);
      addScratchLine([-0.82, 0.37], [-0.82, 0.44]);
      addScratchLine([-0.82, 0.44], [-0.88, 0.44]);
      addScratchLine([-0.88, 0.44], [-0.88, 0.37]);
      addScratchLine([-0.82, 0.44], [-0.82, 0.30]);
      addScratchLine([-0.82, 0.30], [-0.87, 0.30]);
      // Số 6
      addScratchLine([-0.71, 0.44], [-0.76, 0.37]);
      addScratchLine([-0.76, 0.37], [-0.76, 0.30]);
      addScratchLine([-0.76, 0.30], [-0.70, 0.30]);
      addScratchLine([-0.70, 0.30], [-0.70, 0.37]);
      addScratchLine([-0.70, 0.37], [-0.76, 0.37]);
      // Số 3
      addScratchLine([-0.64, 0.44], [-0.58, 0.44]);
      addScratchLine([-0.58, 0.44], [-0.61, 0.37]);
      addScratchLine([-0.61, 0.37], [-0.58, 0.37]);
      addScratchLine([-0.58, 0.37], [-0.58, 0.30]);
      addScratchLine([-0.58, 0.30], [-0.64, 0.30]);

      // Dấu chấm phân cách
      const dotMesh = new THREE.Mesh(eyeGeo, scratchMat);
      dotMesh.position.set(-0.51, 0.37, 0.0335);
      engravingGroup.add(dotMesh);

      // Chữ "T"
      addScratchLine([-0.45, 0.44], [-0.37, 0.44]);
      addScratchLine([-0.41, 0.44], [-0.41, 0.30]);
      // Chữ "Ự"
      addScratchLine([-0.34, 0.44], [-0.34, 0.32]);
      addScratchLine([-0.34, 0.32], [-0.28, 0.32]);
      addScratchLine([-0.28, 0.32], [-0.28, 0.44]);
      addScratchLine([-0.28, 0.44], [-0.26, 0.46]); // móc
      // Dấu nặng chữ Ự
      const dotU = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), scratchMat);
      dotU.position.set(-0.31, 0.27, 0.0335);
      engravingGroup.add(dotU);

      // Chữ "D"
      addScratchLine([-0.21, 0.44], [-0.21, 0.30]);
      addScratchLine([-0.21, 0.44], [-0.15, 0.41]);
      addScratchLine([-0.15, 0.41], [-0.15, 0.33]);
      addScratchLine([-0.15, 0.33], [-0.21, 0.30]);
      // Chữ "O"
      addScratchLine([-0.10, 0.42], [-0.04, 0.42]);
      addScratchLine([-0.04, 0.42], [-0.04, 0.32]);
      addScratchLine([-0.04, 0.32], [-0.10, 0.32]);
      addScratchLine([-0.10, 0.32], [-0.10, 0.42]);

      // 3. Vết xước đá mài thủ công đặc trưng ngục tối (Subtle hand-brush stone scratches)
      for (let s = 0; s < 12; s++) {
        const sx = -1.3 + s * 0.22;
        addScratchLine([sx, 0.48], [sx + 0.12, 0.54], 0.003);
      }

      root.add(engravingGroup);

      // Exploded configuration for X-Ray
      explodedPartsRef.current.push({
        mesh: engravingGroup,
        origin: engravingGroup.position.clone(),
        targetOffset: new THREE.Vector3(0, 0.2, 0.15),
      });
      explodedPartsRef.current.push({
        mesh: teethGroup,
        origin: teethGroup.position.clone(),
        targetOffset: new THREE.Vector3(0, -0.4, 0.08),
      });
    } else if (item.id === 'cum-sat-ham-8') {
      // 2. CÙM CHÂN SẮT HAI TẦNG HẦM SỐ 8
      const ironMat = createMat({ color: 0x6e635b, roughness: 0.52, metalness: 0.82 });
      const boltMat = createMat({ color: 0x8c7c72, roughness: 0.44, metalness: 0.88 });

      // Main heavy crossbar
      const barGeo = new THREE.BoxGeometry(3.2, 0.28, 0.35);
      const barMesh = new THREE.Mesh(barGeo, ironMat);
      root.add(barMesh);

      // Bottom bar
      const bottomBarGeo = new THREE.BoxGeometry(3.0, 0.18, 0.3);
      const bottomBarMesh = new THREE.Mesh(bottomBarGeo, ironMat);
      bottomBarMesh.position.set(0, -0.28, 0);
      root.add(bottomBarMesh);

      // Left Ankle Cuff (Lower half + Upper movable half)
      const cuffLowerGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 24, 1, true, 0, Math.PI);
      const cuffUpperGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 24, 1, true, Math.PI, Math.PI);

      const cuffLeftLower = new THREE.Mesh(cuffLowerGeo, ironMat);
      cuffLeftLower.rotation.x = Math.PI / 2;
      cuffLeftLower.position.set(-0.75, 0.14, 0);
      root.add(cuffLeftLower);

      const cuffLeftUpper = new THREE.Mesh(cuffUpperGeo, ironMat);
      cuffLeftUpper.rotation.x = Math.PI / 2;
      cuffLeftUpper.position.set(-0.75, 0.14, 0);
      root.add(cuffLeftUpper);

      // Right Ankle Cuff
      const cuffRightLower = new THREE.Mesh(cuffLowerGeo, ironMat);
      cuffRightLower.rotation.x = Math.PI / 2;
      cuffRightLower.position.set(0.75, 0.14, 0);
      root.add(cuffRightLower);

      const cuffRightUpper = new THREE.Mesh(cuffUpperGeo, ironMat);
      cuffRightUpper.rotation.x = Math.PI / 2;
      cuffRightUpper.position.set(0.75, 0.14, 0);
      root.add(cuffRightUpper);

      // Sliding Heavy Locking Bolt
      const boltGroup = new THREE.Group();
      const pinGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 16);
      const pinMesh = new THREE.Mesh(pinGeo, boltMat);
      pinMesh.rotation.z = Math.PI / 2;
      boltGroup.add(pinMesh);

      // Lock handle & padlock ring
      const lockPadGeo = new THREE.TorusGeometry(0.14, 0.04, 12, 24);
      const lockPadMesh = new THREE.Mesh(lockPadGeo, boltMat);
      lockPadMesh.position.set(1.7, 0, 0);
      boltGroup.add(lockPadMesh);
      root.add(boltGroup);

      // Rivets along the bar
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const rivetGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const rivet = new THREE.Mesh(rivetGeo, boltMat);
        rivet.position.set(i * 0.45, 0.14, 0.18);
        root.add(rivet);
      }

      // Exploded configuration for X-Ray
      explodedPartsRef.current.push({
        mesh: boltGroup,
        origin: boltGroup.position.clone(),
        targetOffset: new THREE.Vector3(1.2, 0, 0),
      });
      explodedPartsRef.current.push({
        mesh: cuffLeftUpper,
        origin: cuffLeftUpper.position.clone(),
        targetOffset: new THREE.Vector3(0, 0.5, 0.25),
      });
      explodedPartsRef.current.push({
        mesh: cuffRightUpper,
        origin: cuffRightUpper.position.clone(),
        targetOffset: new THREE.Vector3(0, 0.5, 0.25),
      });
    } else if (item.id === 'ca-nuoc-nhom') {
      // 3. CA NƯỚC NHÔM ĐẾM NGÀY SINH TỒN
      const canteenMat = createMat({ color: 0xbfc9d2, roughness: 0.32, metalness: 0.86 });
      const wireMat = createMat({ color: 0x9ba6af, roughness: 0.42, metalness: 0.82 });

      // Main Cylinder Body with subtle taper
      const bodyGeo = new THREE.CylinderGeometry(0.85, 0.78, 1.9, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, canteenMat);
      root.add(bodyMesh);

      // Lip Rim
      const rimGeo = new THREE.TorusGeometry(0.86, 0.04, 12, 32);
      const rimMesh = new THREE.Mesh(rimGeo, canteenMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.95;
      root.add(rimMesh);

      // Base ring
      const baseRimGeo = new THREE.TorusGeometry(0.79, 0.03, 12, 32);
      const baseRimMesh = new THREE.Mesh(baseRimGeo, canteenMat);
      baseRimMesh.rotation.x = Math.PI / 2;
      baseRimMesh.position.y = -0.95;
      root.add(baseRimMesh);

      // Engraved Calendar Rings around body
      for (let r = -2; r <= 2; r++) {
        const lineGeo = new THREE.RingGeometry(0.81, 0.83, 32);
        const lineMesh = new THREE.Mesh(lineGeo, createMat({ color: 0x475159, roughness: 0.6 }));
        lineMesh.rotation.x = Math.PI / 2;
        lineMesh.position.y = r * 0.32;
        root.add(lineMesh);
      }

      // Ergonomic Soldier D-Handle Group
      const handleGroup = new THREE.Group();

      // Smooth continuous D-shaped tube handle from top bracket to bottom bracket
      const handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.83, 0.45, 0),    // Top bracket anchor
        new THREE.Vector3(-1.18, 0.45, 0),    // Top horizontal arm
        new THREE.Vector3(-1.42, 0.28, 0),    // Top ergonomic curve
        new THREE.Vector3(-1.46, 0.0, 0),     // Outer grip center
        new THREE.Vector3(-1.42, -0.28, 0),   // Bottom ergonomic curve
        new THREE.Vector3(-1.14, -0.45, 0),   // Bottom horizontal arm
        new THREE.Vector3(-0.80, -0.45, 0),   // Bottom bracket anchor
      ]);
      const handleGeo = new THREE.TubeGeometry(handleCurve, 48, 0.045, 16, false);
      const handleMesh = new THREE.Mesh(handleGeo, wireMat);
      handleGroup.add(handleMesh);

      // Top mounting bracket & rivet details
      const bTopGeo = new THREE.BoxGeometry(0.08, 0.14, 0.12);
      const bTop = new THREE.Mesh(bTopGeo, wireMat);
      bTop.position.set(-0.83, 0.45, 0);
      handleGroup.add(bTop);

      const rivetGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const rivetTop1 = new THREE.Mesh(rivetGeo, wireMat);
      rivetTop1.position.set(-0.82, 0.45, 0.045);
      handleGroup.add(rivetTop1);
      const rivetTop2 = new THREE.Mesh(rivetGeo, wireMat);
      rivetTop2.position.set(-0.82, 0.45, -0.045);
      handleGroup.add(rivetTop2);

      // Bottom mounting bracket & rivet details
      const bBotGeo = new THREE.BoxGeometry(0.08, 0.14, 0.12);
      const bBot = new THREE.Mesh(bBotGeo, wireMat);
      bBot.position.set(-0.80, -0.45, 0);
      handleGroup.add(bBot);

      const rivetBot1 = new THREE.Mesh(rivetGeo, wireMat);
      rivetBot1.position.set(-0.79, -0.45, 0.045);
      handleGroup.add(rivetBot1);
      const rivetBot2 = new THREE.Mesh(rivetGeo, wireMat);
      rivetBot2.position.set(-0.79, -0.45, -0.045);
      handleGroup.add(rivetBot2);

      root.add(handleGroup);

      // Exploded configuration for X-Ray
      explodedPartsRef.current.push({
        mesh: handleGroup,
        origin: handleGroup.position.clone(),
        targetOffset: new THREE.Vector3(-0.65, 0, 0),
      });
    } else {
      // 4. KHUY ÁO GỖ GIẤU MẬT THƯ VƯỢT NGỤC
      const woodMat = createMat({ color: 0x93623d, roughness: 0.48, metalness: 0.08 });
      const foilMat = createMat({ color: 0xf6f0e2, roughness: 0.28, metalness: 0.92 });

      // Bottom Button Base with hollowed core
      const baseGeo = new THREE.CylinderGeometry(1.3, 1.25, 0.32, 32);
      const baseMesh = new THREE.Mesh(baseGeo, woodMat);
      root.add(baseMesh);

      // Rim collar
      const collarGeo = new THREE.TorusGeometry(1.28, 0.08, 16, 32);
      const collarMesh = new THREE.Mesh(collarGeo, woodMat);
      collarMesh.rotation.x = Math.PI / 2;
      root.add(collarMesh);

      // 4 Center thread holes
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x110b06 });
      const holeGeo = new THREE.CircleGeometry(0.08, 16);
      const offsets = [
        [-0.3, -0.3],
        [0.3, -0.3],
        [-0.3, 0.3],
        [0.3, 0.3],
      ];
      offsets.forEach(([hx, hy]) => {
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.rotation.x = -Math.PI / 2;
        hole.position.set(hx, 0.17, hy);
        root.add(hole);
      });

      // Detachable Secret Wood Lid
      const lidGroup = new THREE.Group();
      const lidGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 32);
      const lidMesh = new THREE.Mesh(lidGeo, woodMat);
      lidGroup.add(lidMesh);
      lidGroup.position.set(0, 0.18, 0);
      root.add(lidGroup);

      // Concealed Rolled Secret Tin Foil Letter
      const letterGroup = new THREE.Group();
      const letterGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.55, 24);
      const letterMesh = new THREE.Mesh(letterGeo, foilMat);
      letterMesh.rotation.z = Math.PI / 2;
      letterGroup.add(letterMesh);

      // Folded foil seam
      const seamGeo = new THREE.PlaneGeometry(0.35, 0.5);
      const seamMesh = new THREE.Mesh(seamGeo, foilMat);
      seamMesh.rotation.y = Math.PI / 4;
      seamMesh.position.set(0.12, 0.1, 0);
      letterGroup.add(seamMesh);

      letterGroup.position.set(0, 0.05, 0);
      root.add(letterGroup);

      // Exploded configuration for X-Ray
      explodedPartsRef.current.push({
        mesh: lidGroup,
        origin: lidGroup.position.clone(),
        targetOffset: new THREE.Vector3(0, 0.85, 0),
      });
      explodedPartsRef.current.push({
        mesh: letterGroup,
        origin: letterGroup.position.clone(),
        targetOffset: new THREE.Vector3(0, 0.5, 0.6),
      });
    }

    return root;
  }, []);

  // =========================================================================
  // SCENE INITIALIZATION & CLEANUP
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, Math.max(0.1, width / height), 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    rendererRef.current = renderer;

    // 4. Studio & Flashlight Rig
    // A. Ambient & Hemisphere for bright, clear baseline visibility
    const ambLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x3d3835, 1.0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // B. Studio Key & Fill Lights
    const keyLight = new THREE.SpotLight(0xfff5e4, 4.5);
    keyLight.position.set(4, 5, 5);
    keyLight.angle = Math.PI / 3.5;
    keyLight.penumbra = 0.5;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.PointLight(0x7dd3fc, 2.2, 25);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // C. Frontal Rim Light (prevents silhouette darkness)
    const frontRimLight = new THREE.DirectionalLight(0xffffff, 1.3);
    frontRimLight.position.set(0, 0.5, 6);
    scene.add(frontRimLight);

    // D. 3D FLASHLIGHT RIG (ĐÈN PIN RỌI THEO CHUỘT)
    const flashTarget = new THREE.Object3D();
    scene.add(flashTarget);
    flashTargetRef.current = flashTarget;

    const flashSpot = new THREE.SpotLight(0xfffaea, 10.5);
    flashSpot.angle = Math.PI / 5.2; // ~34 degree focused flashlight beam
    flashSpot.penumbra = 0.45;
    flashSpot.decay = 1.1;
    flashSpot.distance = 25;
    flashSpot.target = flashTarget;
    flashSpot.position.set(0, 0, 4.5);
    scene.add(flashSpot);
    flashSpotRef.current = flashSpot;

    // High-intensity surface bulb directly illuminating cursor target point
    const flashBulb = new THREE.PointLight(0xfffae0, 7.0, 5.5, 1.2);
    flashBulb.position.set(0, 0, 2.0);
    scene.add(flashBulb);
    flashBulbRef.current = flashBulb;

    // Soft Ground Reflection Plane (Shadow Floor)
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.6;
    scene.add(shadowPlane);

    // 5. Initial Model Setup
    const modelGroup = buildArtifactGeometry(artifact, isXRay);
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      cameraRef.current.aspect = Math.max(0.1, w / h);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // Native Mouse Wheel Zoom on 3D Container
    const onContainerWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
      const nextZoom = Math.min(2.5, Math.max(0.7, parseFloat((zoomRef.current + zoomDelta).toFixed(2))));
      if (onZoomChangeRef.current) {
        onZoomChangeRef.current(nextZoom);
      }
    };
    container.addEventListener('wheel', onContainerWheel, { passive: false });

    // 6. Animation Render Loop (Physics & Lerp Damping)
    let lastTime = performance.now();
    const renderLoop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(renderLoop);
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const state = rotStateRef.current;
      const now = Date.now();

      // Inertia & Auto-Turntable logic
      if (!state.isDragging) {
        // Friction dampening
        state.velX *= 0.94;
        state.velY *= 0.94;
        state.targetX += state.velX;
        state.targetY += state.velY;

        // Auto Turntable when idle
        if (autoRotateRef.current && now - state.lastInteractionTime > 1800) {
          state.targetY += 0.0065;
        }
      }

      // Clamp X tilt
      state.targetX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, state.targetX));

      // Ultra-smooth Lerp Damping (0.08 smoothing factor)
      state.currentY += (state.targetY - state.currentY) * 0.085;
      state.currentX += (state.targetX - state.currentX) * 0.085;

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = state.currentY;
        modelGroupRef.current.rotation.x = state.currentX;

        // Exploded parts animation
        explodedPartsRef.current.forEach((part) => {
          const target = xRayRef.current ? part.origin.clone().add(part.targetOffset) : part.origin;
          part.mesh.position.lerp(target, 0.09);
        });

        // Calculate 2D screen positions for Hotspots
        if (artifactRef.current.hotspots && cameraRef.current && container) {
          const projected: ProjectedHotspot[] = artifactRef.current.hotspots.map((hs) => {
            const v = new THREE.Vector3(...hs.position);
            v.applyMatrix4(modelGroupRef.current!.matrixWorld);
            v.project(cameraRef.current!);

            const screenX = (v.x * 0.5 + 0.5) * 100;
            const screenY = (-(v.y * 0.5) + 0.5) * 100;
            const visible = v.z < 1.0 && screenX >= 5 && screenX <= 95 && screenY >= 5 && screenY <= 95;

            return {
              hotspot: hs,
              screenX,
              screenY,
              visible,
            };
          });
          setProjectedHotspots(projected);
        }
      }

      // Camera distance zoom lerp using active zoomRef
      if (cameraRef.current) {
        const targetZ = 5.2 / zoomRef.current;
        cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.12;
      }

      // 3D FLASHLIGHT BEAM TRACKING (Đèn pin rọi theo chuột)
      if (flashSpotRef.current && flashBulbRef.current && flashTargetRef.current && cameraRef.current) {
        const mouse = mouseCoordsRef.current;
        const raycaster = raycasterRef.current;

        if (mouse.active && modelGroupRef.current) {
          const mouseVec = new THREE.Vector2(mouse.x, mouse.y);
          raycaster.setFromCamera(mouseVec, cameraRef.current);
          const hits = raycaster.intersectObjects(modelGroupRef.current.children, true);

          if (hits.length > 0) {
            const hitPoint = hits[0].point;
            flashLerpTargetRef.current.lerp(hitPoint, 0.35);
            flashTargetRef.current.position.copy(flashLerpTargetRef.current);

            // Flashlight source stands back towards camera with natural angle
            const spotSrc = new THREE.Vector3(
              flashLerpTargetRef.current.x * 0.7 + mouse.x * 0.9,
              flashLerpTargetRef.current.y * 0.7 + mouse.y * 0.9,
              cameraRef.current.position.z - 1.2
            );
            flashSpotRef.current.position.lerp(spotSrc, 0.3);

            // Bulb sits right above the illuminated surface to make details glow brightly
            const normalOffset = hits[0].face ? hits[0].face.normal.clone().multiplyScalar(0.35) : new THREE.Vector3(0, 0, 0.35);
            const bulbPos = flashLerpTargetRef.current.clone().add(normalOffset);
            flashBulbRef.current.position.lerp(bulbPos, 0.35);

            flashSpotRef.current.intensity = 12.0;
            flashBulbRef.current.intensity = 8.0;
          } else {
            // Hovering outside the mesh: project ray towards z=0
            const unprojected = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(cameraRef.current);
            const dir = unprojected.sub(cameraRef.current.position).normalize();
            const dist = -cameraRef.current.position.z / dir.z;
            const planePos = cameraRef.current.position.clone().add(dir.multiplyScalar(dist));

            flashLerpTargetRef.current.lerp(planePos, 0.25);
            flashTargetRef.current.position.copy(flashLerpTargetRef.current);

            const spotSrc = new THREE.Vector3(mouse.x * 2.2, mouse.y * 2.2, cameraRef.current.position.z - 1.4);
            flashSpotRef.current.position.lerp(spotSrc, 0.25);
            flashBulbRef.current.position.lerp(new THREE.Vector3(planePos.x, planePos.y, 1.2), 0.25);

            flashSpotRef.current.intensity = 8.5;
            flashBulbRef.current.intensity = 5.0;
          }
        } else {
          // Idle: soft center spotlight
          flashTargetRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.08);
          flashSpotRef.current.position.lerp(new THREE.Vector3(0, 0.5, 4.2), 0.08);
          flashBulbRef.current.position.lerp(new THREE.Vector3(0, 0, 1.8), 0.08);
          flashSpotRef.current.intensity = 7.0;
          flashBulbRef.current.intensity = 4.0;
        }
      }

      // Candlelight subtle flicker effect
      if (lightingModeRef.current === 'dungeon' && fillLightRef.current) {
        fillLightRef.current.intensity = 1.3 + Math.sin(time * 0.005) * 0.25;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      container.removeEventListener('wheel', onContainerWheel);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, [artifact.id]); // rebuild when artifact switches

  // =========================================================================
  // X-RAY & GEOMETRY REBUILD TOGGLE
  // =========================================================================
  useEffect(() => {
    if (!sceneRef.current || !modelGroupRef.current) return;
    sceneRef.current.remove(modelGroupRef.current);
    const newModel = buildArtifactGeometry(artifact, isXRay);
    sceneRef.current.add(newModel);
    modelGroupRef.current = newModel;
  }, [isXRay, buildArtifactGeometry, artifact]);

  // =========================================================================
  // LIGHTING PRESETS UPDATE
  // =========================================================================
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambLightRef.current) return;

    if (lightingMode === 'dungeon') {
      // Ánh nến ngục tối (ấm áp nhưng rõ nét, không bị tối đen)
      ambLightRef.current.intensity = 0.75;
      ambLightRef.current.color.setHex(0x382c20);

      keyLightRef.current.color.setHex(0xffab48);
      keyLightRef.current.intensity = 4.5;

      fillLightRef.current.color.setHex(0xff8811);
      fillLightRef.current.intensity = 2.4;

      if (hemiLightRef.current) hemiLightRef.current.intensity = 0.65;
    } else if (lightingMode === 'museum') {
      // Ánh sáng bảo tàng chuẩn quốc tế (rực rỡ, sắc nét)
      ambLightRef.current.intensity = 1.15;
      ambLightRef.current.color.setHex(0xffffff);

      keyLightRef.current.color.setHex(0xf8fafc);
      keyLightRef.current.intensity = 4.8;

      fillLightRef.current.color.setHex(0x38bdf8);
      fillLightRef.current.intensity = 2.2;

      if (hemiLightRef.current) hemiLightRef.current.intensity = 1.0;
    } else {
      // Ánh ban mai đồi Thiên Thai tự do (tươi sáng, rực rỡ)
      ambLightRef.current.intensity = 1.1;
      ambLightRef.current.color.setHex(0xfef9c3);

      keyLightRef.current.color.setHex(0xfef08a);
      keyLightRef.current.intensity = 4.6;

      fillLightRef.current.color.setHex(0x34d399);
      fillLightRef.current.intensity = 2.4;

      if (hemiLightRef.current) hemiLightRef.current.intensity = 0.95;
    }
  }, [lightingMode]);

  // =========================================================================
  // POINTER & TOUCH GESTURES (PHYSICS INERTIA & FLASHLIGHT)
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent) => {
    const state = rotStateRef.current;
    state.isDragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.velX = 0;
    state.velY = 0;
    state.lastInteractionTime = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = rotStateRef.current;

    // Dynamic Mouse Coordinates for 3D Flashlight Raycasting & 2D Optical Halo
    if (mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseCoordsRef.current = { x, y, active: true };
      setFlashlightPixelPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
    }

    if (!state.isDragging) return;

    const deltaX = e.clientX - state.lastX;
    const deltaY = e.clientY - state.lastY;

    state.lastX = e.clientX;
    state.lastY = e.clientY;

    state.velY = deltaX * 0.0075;
    state.velX = deltaY * 0.0075;

    state.targetY += state.velY;
    state.targetX += state.velX;

    state.lastInteractionTime = Date.now();
  };

  const handlePointerUp = () => {
    rotStateRef.current.isDragging = false;
    rotStateRef.current.lastInteractionTime = Date.now();
  };

  const handlePointerLeave = () => {
    rotStateRef.current.isDragging = false;
    mouseCoordsRef.current.active = false;
    setFlashlightPixelPos((p) => ({ ...p, active: false }));
  };

  // Focus on specific hotspot (Smooth camera orientation)
  const handleHotspotClick = (hs: ArtifactHotspot) => {
    playChimeSound(1050, 'triangle');
    if (onSelectHotspot) onSelectHotspot(hs);

    // Turn artifact smoothly toward hotspot face
    const state = rotStateRef.current;
    state.targetY = Math.atan2(hs.position[0], hs.position[2]);
    state.targetX = -hs.position[1] * 0.4;
    state.lastInteractionTime = Date.now();
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full min-h-[380px] sm:min-h-[480px] select-none cursor-crosshair active:cursor-grabbing overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 2D Flashlight Optical Beam Aura following cursor */}
      {flashlightPixelPos.active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-150 z-20"
          style={{
            left: flashlightPixelPos.x,
            top: flashlightPixelPos.y,
            width: '180px',
            height: '180px',
            background:
              'radial-gradient(circle, rgba(254, 240, 138, 0.28) 0%, rgba(251, 191, 36, 0.12) 35%, rgba(251, 191, 36, 0.04) 55%, transparent 75%)',
            boxShadow: '0 0 30px rgba(253, 224, 71, 0.18)',
          }}
        >
          {/* Subtle Flashlight Center Core Ring */}
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-yellow-300/60 bg-yellow-200/25 shadow-[0_0_12px_#fde047]" />
        </div>
      )}

      {/* 2D Interactive Hotspots Overlay */}
      {projectedHotspots.map(({ hotspot, screenX, screenY, visible }) => {
        if (!visible) return null;
        const isSelected = selectedHotspotId === hotspot.id;

        return (
          <div
            key={hotspot.id}
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-20 pointer-events-auto transition-transform duration-200"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleHotspotClick(hotspot);
              }}
              title={hotspot.title}
              className={`group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                isSelected
                  ? 'scale-125 ring-4 ring-yellow-400/50 bg-amber-500'
                  : 'hover:scale-115 bg-black/70 border border-white/40'
              }`}
            >
              {/* Radar pulse ripples */}
              <span className="absolute inset-0 rounded-full animate-ping bg-amber-400/40" />
              <span
                className={`relative h-3 w-3 rounded-full transition-colors ${
                  isSelected ? 'bg-white shadow-[0_0_12px_#ffd700]' : 'bg-amber-400 group-hover:bg-yellow-300'
                }`}
              />

              {/* Tooltip Tag */}
              <span className="absolute left-6 top-1/2 -translate-y-1/2 hidden whitespace-nowrap rounded-lg bg-black/90 px-2.5 py-1 text-xs font-semibold text-white shadow-xl backdrop-blur-md group-hover:inline-block border border-white/20">
                {hotspot.title}
              </span>
            </button>
          </div>
        );
      })}

      {/* Dynamic Flashlight Prompt Banner */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[11px] uppercase tracking-[0.16em] text-amber-200 bg-black/75 px-4 py-1.5 rounded-full backdrop-blur-md border border-amber-500/35 flex items-center gap-2 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>🔦 Đèn Pin 3D • Rê Chuột Rọi Sáng Chi Tiết • Kéo Xoay 360°</span>
      </div>
    </div>
  );
}
