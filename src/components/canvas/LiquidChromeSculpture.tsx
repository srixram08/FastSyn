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
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Calibrated exposure prevents flat-white blowout

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. High-Contrast Studio Reflection Map (Produces the metallic liquid mercury sheen with rainbow highlights)
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      // Deep dark reflective cosmic studio background
      ctx.fillStyle = "#090316";
      ctx.fillRect(0, 0, 1024, 512);

      // Bright white overhead light strip (reflects sharp specular highlights on upper ridges)
      const topGrad = ctx.createLinearGradient(0, 0, 0, 190);
      topGrad.addColorStop(0, "#ffffff");
      topGrad.addColorStop(0.35, "#f5d0fe");
      topGrad.addColorStop(0.7, "#c084fc");
      topGrad.addColorStop(1, "rgba(9, 3, 22, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(160, 0, 704, 190);

      // Vibrant cyan chromatic softbox (creates the electric cyan/turquoise metallic sheen)
      const cyanGrad = ctx.createLinearGradient(0, 130, 390, 370);
      cyanGrad.addColorStop(0, "#ffffff");
      cyanGrad.addColorStop(0.35, "#38bdf8");
      cyanGrad.addColorStop(0.75, "#0284c7");
      cyanGrad.addColorStop(1, "rgba(9, 3, 22, 0)");
      ctx.fillStyle = cyanGrad;
      ctx.fillRect(0, 130, 390, 240);

      // Vibrant magenta/rose chromatic softbox (creates the hot pink/magenta reflections)
      const pinkGrad = ctx.createLinearGradient(1024, 130, 630, 370);
      pinkGrad.addColorStop(0, "#ffffff");
      pinkGrad.addColorStop(0.35, "#f472b6");
      pinkGrad.addColorStop(0.75, "#db2777");
      pinkGrad.addColorStop(1, "rgba(9, 3, 22, 0)");
      ctx.fillStyle = pinkGrad;
      ctx.fillRect(630, 130, 394, 240);

      // Warm golden accent reflector (creates gold/amber highlights in crevices)
      const goldGrad = ctx.createRadialGradient(512, 390, 15, 512, 390, 170);
      goldGrad.addColorStop(0, "#fde68a");
      goldGrad.addColorStop(0.5, "#f59e0b");
      goldGrad.addColorStop(1, "rgba(9, 3, 22, 0)");
      ctx.fillStyle = goldGrad;
      ctx.fillRect(330, 260, 364, 252);
    }

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 3. Balanced Studio Lighting (Crisp highlights, deep chrome crevices, zero flat-white washout)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // Directional white key light for sharp specular definition
    const whiteKeyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    whiteKeyLight.position.set(3, 5, 5);
    scene.add(whiteKeyLight);

    // Directional rim light for crisp edges
    const rimLight = new THREE.DirectionalLight(0xe0e7ff, 1.4);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Top intense purple beam light source (matching reference image)
    const topBeamLight = new THREE.PointLight(0xd946ef, 11, 35);
    topBeamLight.position.set(0, 7, 2.5);
    scene.add(topBeamLight);

    // Chromatic fill lights
    const cyanLight = new THREE.PointLight(0x38bdf8, 6.5, 25);
    cyanLight.position.set(-6, -1, 5);
    scene.add(cyanLight);

    const roseLight = new THREE.PointLight(0xf472b6, 6.5, 25);
    roseLight.position.set(6, -1, 5);
    scene.add(roseLight);

    const goldLight = new THREE.PointLight(0xfbbf24, 4.0, 20);
    goldLight.position.set(0, -6, 3);
    scene.add(goldLight);

    // 4. Intricate Multi-Fold Ribbon Geometry (Tightly wound like the Neura reference image!)
    // (p=3, q=5, tube=0.34 creates multiple delicate overlapping chrome folds rather than a single fat tube)
    const geometry = new THREE.TorusKnotGeometry(1.55, 0.34, 320, 56, 3, 5);

    // Fluid organic ripples matching melted liquid metal
    const posAttr = geometry.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const ripple = 1.0 + 0.05 * Math.sin(v.x * 3.6 + v.y * 3.0) * Math.cos(v.z * 3.6);
      v.multiplyScalar(ripple);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals();

    // 5. True Iridescent Liquid Chrome / Mercury Material (Identical to reference)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x140a26, // Deep tinted metallic chrome base (prevents flat white saturation)
      metalness: 0.95, // High metalness reflects environment colors like real liquid mercury
      roughness: 0.11, // Smooth mirror-like reflection
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      iridescence: 1.0, // Chromatic rainbow sheen
      iridescenceIOR: 1.88,
      iridescenceThicknessRange: [130, 820],
      sheen: 1.0,
      sheenColor: new THREE.Color(0xf472b6),
      wireframe: false,
    });

    const sculpture = new THREE.Mesh(geometry, material);
    scene.add(sculpture);

    // 6. Inner Glowing Synaptic Core
    const coreGeo = new THREE.IcosahedronGeometry(0.75, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    sculpture.add(innerCore);

    // 7. Upward Flowing 3D Synaptic Energy Particles
    const particleCount = 130;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);
    const pWobble = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;
      pSpeeds[i] = 0.018 + Math.random() * 0.035;
      pWobble[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xf5d0fe,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 8. Mouse Parallax Interaction
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

    // 9. Resize Handler
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
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth rotation with mouse influence
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;

      sculpture.rotation.x = elapsed * 0.28 + targetRotationX;
      sculpture.rotation.y = elapsed * 0.42 + targetRotationY;

      // Inner core counter-rotates
      innerCore.rotation.x = -elapsed * 0.6;
      innerCore.rotation.y = -elapsed * 0.7;

      // Real-time Upward Flowing 3D Particles
      const positions = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += pSpeeds[i];
        positions[i * 3] += Math.sin(elapsed * 2 + pWobble[i]) * 0.005;

        // Wrap around when reaching top threshold
        if (positions[i * 3 + 1] > 4.5) {
          positions[i * 3 + 1] = -4.5;
          const radius = 1.8 + Math.random() * 2.8;
          const angle = Math.random() * Math.PI * 2;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      // Dynamic chromatic light pulsation
      topBeamLight.intensity = 11 + Math.sin(elapsed * 2.2) * 2.5;
      cyanLight.intensity = 6.5 + Math.cos(elapsed * 2.5) * 1.5;
      roseLight.intensity = 6.5 + Math.sin(elapsed * 1.9) * 1.5;

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
      envTexture.dispose();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* ========================================================================= */}
      {/* INTENSE VERTICAL PURPLE LIGHT BEAM FLOWING UP (EXACT MATCH TO REFERENCE)  */}
      {/* ========================================================================= */}

      {/* 1. Wide Ambient Deep Purple Aurora Bloom */}
      <div 
        className="absolute -top-64 w-[360px] sm:w-[500px] h-[780px] pointer-events-none opacity-85 blur-[90px] animate-aurora-beam"
        style={{
          background: "radial-gradient(ellipse at 50% 90%, rgba(217, 70, 239, 0.95) 0%, rgba(147, 51, 234, 0.7) 40%, rgba(99, 102, 241, 0.25) 75%, transparent 100%)",
        }}
      />

      {/* 2. Focused Vertical Neon Purple Pillar Rising Straight Up */}
      <div 
        className="absolute -top-72 w-[110px] sm:w-[150px] h-[720px] pointer-events-none opacity-95 blur-2xl animate-aurora-beam"
        style={{
          background: "linear-gradient(to top, rgba(236, 72, 153, 0.95) 0%, rgba(192, 132, 252, 1) 35%, rgba(147, 51, 234, 0.85) 70%, transparent 100%)",
        }}
      />

      {/* 3. Ultra-Bright White-Violet Core Ray Ascending Upwards */}
      <div 
        className="absolute -top-72 w-[22px] sm:w-[32px] h-[640px] pointer-events-none opacity-100 blur-md animate-beam-ascend"
        style={{
          background: "linear-gradient(to top, #ffffff 0%, #f472b6 25%, #c084fc 65%, transparent 100%)",
        }}
      />

      {/* 4. Ascending Light Energy Streaks Flowing Up Inside Beam */}
      <div className="absolute -top-56 w-[6px] h-[120px] bg-gradient-to-t from-white via-fuchsia-300 to-transparent blur-[2px] opacity-80 animate-energy-streak pointer-events-none" style={{ animationDelay: "0s" }} />
      <div className="absolute -top-64 w-[8px] h-[160px] bg-gradient-to-t from-white via-purple-300 to-transparent blur-[3px] opacity-70 animate-energy-streak pointer-events-none" style={{ animationDelay: "1.4s" }} />
      <div className="absolute -top-48 w-[5px] h-[90px] bg-gradient-to-t from-cyan-200 via-fuchsia-300 to-transparent blur-[2px] opacity-90 animate-energy-streak pointer-events-none" style={{ animationDelay: "2.6s" }} />

      {/* 5. Glowing Radial Disc Directly Behind the Sculpture Silhouette */}
      <div 
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(192, 132, 252, 0.45) 0%, rgba(236, 72, 153, 0.2) 45%, rgba(147, 51, 234, 0.1) 70%, transparent 90%)",
        }}
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] relative z-10 cursor-grab active:cursor-grabbing" />
    </div>
  );
};
