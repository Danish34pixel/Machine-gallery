import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const LoadingScreen = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 3;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    let model;

    loader.load(
      "/Strength_in_Focus_0601190043_texture.glb", // make sure this file is in the public folder
      (gltf) => {
        model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB:", error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.02;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div ref={mountRef} className="mb-4" />
      <p className="text-lg animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
