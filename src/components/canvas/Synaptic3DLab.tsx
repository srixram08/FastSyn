"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Activity, Layers, RotateCw, Play, Eye } from "lucide-react";
import { ModelId } from "@/engine/types";

interface Synaptic3DLabProps {
  currentModelId?: ModelId;
  onModelSelect?: (id: ModelId) => void;
  className?: string;
  isCompact?: boolean;
}

export const Synaptic3DLab: React.FC<Synaptic3DLabProps> = ({
  currentModelId = "bdh_fast_weight",
  onModelSelect,
  className = "",
  isCompact = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [activeModel, setActiveModel] = useState<ModelId>(currentModelId);

  // Sync state if prop changes
  useEffect(() => {
    setActiveModel(currentModelId);
  }, [currentModelId]);

  const triggerPulse = () => {
    setIsPulsing(true);
    setPulseCount((prev) => prev + 1);
    setTimeout(() => setIsPulsing(false), 1200);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    // Subtle atmospheric fog for visual depth
    scene.fog = new THREE.FogExp2(0x04060a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 4, 30);
    cyanPoint.position.set(-6, 4, 6);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0x8b5cf6, 4, 30);
    violetPoint.position.set(6, -4, 6);
    scene.add(violetPoint);

    const emeraldPoint = new THREE.PointLight(0x10b981, 3, 25);
    emeraldPoint.position.set(0, 6, -4);
    scene.add(emeraldPoint);

    // Main 3D Group
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // 3. Central Frozen Weights Outer Shell (Translucent Glass Cage)
    const shellGeo = new THREE.IcosahedronGeometry(4.8, 1);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      roughness: 0.2,
      metalness: 0.8,
    });
    const frozenShell = new THREE.Mesh(shellGeo, shellMat);
    networkGroup.add(frozenShell);

    // 4. Dynamic Synaptic Memory Core (Adaptive Inner Torus)
    const coreGeo = new THREE.TorusGeometry(2.2, 0.35, 16, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: true,
    });
    const memoryCore = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(memoryCore);

    // 5. 3D Synaptic Nodes (Neurons)
    const nodeCount = 28;
    const nodeMeshes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      // Golden spiral on sphere surface
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 3.6 + (Math.sin(i * 1.5) * 0.5);

      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions.push(pos);

      // Node colors based on function: Inputs (Cyan), Synaptic (Violet), Outputs (Emerald)
      let nodeColor = 0x06b6d4;
      if (i % 3 === 1) nodeColor = 0x8b5cf6;
      if (i % 3 === 2) nodeColor = 0x10b981;

      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.8,
      });

      const nodeMesh = new THREE.Mesh(sphereGeo, nodeMat);
      nodeMesh.position.copy(pos);
      networkGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // 6. Dynamic Synaptic Connections (3D Edges / Synapses)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const linePositions: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 3.2) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const synapticLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    networkGroup.add(synapticLines);

    // 7. Floating Synaptic Vesicles (3D Particle Dust)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const pRadius = 5.5 + Math.random() * 4;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * pRadius;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      particlePositions[i * 3] = r * sinPhi * cosTheta;
      particlePositions[i * 3 + 1] = r * sinPhi * sinTheta;
      particlePositions[i * 3 + 2] = r * cosPhi;

      // Color variations: cyan, violet, emerald
      const colorChoice = Math.random();
      if (colorChoice > 0.6) {
        particleColors[i * 3] = 0.02; particleColors[i * 3 + 1] = 0.71; particleColors[i * 3 + 2] = 0.83; // cyan
      } else if (colorChoice > 0.3) {
        particleColors[i * 3] = 0.54; particleColors[i * 3 + 1] = 0.36; particleColors[i * 3 + 2] = 0.96; // violet
      } else {
        particleColors[i * 3] = 0.06; particleColors[i * 3 + 1] = 0.72; particleColors[i * 3 + 2] = 0.50; // emerald
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    networkGroup.add(particles);

    // 8. Mouse Parallax & Drag Rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = normX * 0.4;
      mouseY = normY * 0.4;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation with damping
      networkGroup.rotation.y += (targetRotationY + mouseX * 0.5 - networkGroup.rotation.y) * 0.05 + 0.003;
      networkGroup.rotation.x += (targetRotationX + mouseY * 0.5 - networkGroup.rotation.x) * 0.05;

      // Independent core dynamic rotation
      memoryCore.rotation.x = elapsedTime * 0.6;
      memoryCore.rotation.y = elapsedTime * 0.9;

      // Particles orbit
      particles.rotation.y = -elapsedTime * 0.05;
      particles.rotation.z = elapsedTime * 0.02;

      // Shell breathing
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.02;
      frozenShell.scale.set(scale, scale, scale);

      // Model-specific visual modulation
      if (activeModel === "bdh_fast_weight") {
        lineMaterial.color.setHex(0x06b6d4);
        lineMaterial.opacity = 0.55 + Math.sin(elapsedTime * 4) * 0.15;
        coreMat.color.setHex(0x06b6d4);
        coreMat.emissive.setHex(0x06b6d4);
        coreMat.emissiveIntensity = 1.0;
      } else if (activeModel === "transformer_kv") {
        lineMaterial.color.setHex(0x8b5cf6);
        lineMaterial.opacity = 0.45;
        coreMat.color.setHex(0x8b5cf6);
        coreMat.emissive.setHex(0x8b5cf6);
        coreMat.emissiveIntensity = 0.8;
      } else if (activeModel === "ssm_state") {
        lineMaterial.color.setHex(0x10b981);
        lineMaterial.opacity = 0.45;
        coreMat.color.setHex(0x10b981);
        coreMat.emissive.setHex(0x10b981);
        coreMat.emissiveIntensity = 0.8;
      } else {
        // Static
        lineMaterial.color.setHex(0x64748b);
        lineMaterial.opacity = 0.2;
        coreMat.color.setHex(0x475569);
        coreMat.emissive.setHex(0x334155);
        coreMat.emissiveIntensity = 0.2;
      }

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      sphereGeo.dispose();
      lineGeometry.dispose();
      particleGeo.dispose();
      shellGeo.dispose();
      coreGeo.dispose();
    };
  }, [activeModel]);

  return (
    <div className={`relative liquid-glass rounded-2xl overflow-hidden border border-cyan-500/30 p-1 group shadow-2xl ${className}`}>
      {/* Liquid Sheen Accent Banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 z-10" />

      {/* Top Floating Glass Header */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
            3D Synaptic Lab Engine
          </span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full font-mono">
            WebGL 3D
          </span>
        </div>

        {/* Model Architecture Switcher directly in 3D canvas */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md p-1 rounded-xl border border-white/10">
          {(
            [
              { id: "bdh_fast_weight", label: "BDH Synapses", color: "text-cyan-400 border-cyan-500/40" },
              { id: "transformer_kv", label: "Transformer KV", color: "text-violet-400 border-violet-500/40" },
              { id: "ssm_state", label: "SSM Hidden", color: "text-emerald-400 border-emerald-500/40" },
              { id: "static_baseline", label: "Static", color: "text-slate-400 border-slate-600/40" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveModel(m.id);
                if (onModelSelect) onModelSelect(m.id);
              }}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-all ${
                activeModel === m.id
                  ? `bg-white/15 ${m.color} border font-bold shadow-sm`
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[360px] md:h-[420px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Bottom Floating Interactive Action Bar */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Drag to rotate 3D graph •</span>
          <span className="text-cyan-300 font-semibold">
            {activeModel === "bdh_fast_weight"
              ? "Fast Synaptic Updates Active (RAM)"
              : activeModel === "transformer_kv"
              ? "KV Cache Token Stream"
              : activeModel === "ssm_state"
              ? "Recurrent Hidden State"
              : "Weights Fixed • Zero Adaptation"}
          </span>
        </div>

        <button
          onClick={triggerPulse}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Pulse Synapses ({pulseCount})</span>
        </button>
      </div>

      {/* Synaptic Pulse Flash Overlay */}
      {isPulsing && (
        <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none animate-pulse transition-opacity" />
      )}
    </div>
  );
};
