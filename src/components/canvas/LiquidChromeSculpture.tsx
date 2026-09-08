"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const LiquidChromeSculpture: React.FC<{ className?: string }> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lighting for Iridescent Chrome & Glass Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key purple light (matching reference beam)
    const purpleLight = new THREE.PointLight(0xa855f7, 8, 30);
    purpleLight.position.set(0, 8, 4);
    scene.add(purpleLight);

    // Cyan rim light for chromatic reflection
    const cyanLight = new THREE.PointLight(0x06b6d4, 6, 25);
    cyanLight.position.set(-6, -2, 5);
    scene.add(cyanLight);

    // Magenta / Rose accent light
    const roseLight = new THREE.PointLight(0xec4899, 6, 25);
    roseLight.position.set(6, -2, 5);
    scene.add(roseLight);

    // Amber warm bottom light
    const amberLight = new THREE.PointLight(0xf59e0b, 4, 20);
    amberLight.position.set(0, -6, 2);
    scene.add(amberLight);

    // 3. Fluid Liquid Chrome Torus Knot Geometry
    // TorusKnotGeometry gives that mesmerizing ribboned, twisted liquid glass appearance from the reference image
    const geometry = new THREE.TorusKnotGeometry(2.0, 0.65, 200, 36, 2, 3);

    // High-end Physical Material simulating iridescent metallic liquid glass
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      transmission: 0.25, // Subtle glass refraction
      ior: 1.6,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xd8b4fe),
      wireframe: false,
    });

    const sculpture = new THREE.Mesh(geometry, material);
    scene.add(sculpture);

    // 4. Subtle Inner Floating Synaptic Core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    sculpture.add(innerCore);

    // 5. Floating Iridescent Particle Halo
    const particleCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xe9d5ff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 6. Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = normX * 0.45;
      mouseY = normY * 0.45;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth rotation with mouse influence
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;

      sculpture.rotation.x = elapsed * 0.35 + targetRotationX;
      sculpture.rotation.y = elapsed * 0.5 + targetRotationY;

      // Inner core counter-rotates
      innerCore.rotation.x = -elapsed * 0.7;
      innerCore.rotation.y = -elapsed * 0.8;

      // Particle halo slow drift
      particles.rotation.y = -elapsed * 0.1;

      // Dynamic chromatic light pulsation
      purpleLight.intensity = 7 + Math.sin(elapsed * 2) * 2;
      cyanLight.intensity = 5 + Math.cos(elapsed * 2.5) * 1.5;
      roseLight.intensity = 5 + Math.sin(elapsed * 1.8) * 1.5;

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Intense Vertical Aurora Light Beam Rising Upwards (Exact match to reference image!) */}
      <div 
        className="absolute -top-40 w-[240px] h-[550px] pointer-events-none opacity-80 blur-3xl animate-aurora-beam"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(192, 132, 252, 0.95) 0%, rgba(147, 51, 234, 0.6) 40%, rgba(99, 102, 241, 0.2) 70%, transparent 100%)",
        }}
      />

      {/* Ambient glowing radial disc behind the 3D sculpture */}
      <div 
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 80%)",
        }}
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] relative z-10 cursor-grab active:cursor-grabbing" />
    </div>
  );
};
