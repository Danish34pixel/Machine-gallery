import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const MachineGallery = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gym machinery data
  const machines = [
    {
      id: 1,
      name: "Commercial Treadmill Pro",
      category: "Cardio",
      description:
        "Professional-grade treadmill with advanced shock absorption and interactive training programs.",
      specs: {
        "Max Speed": "20 km/h",
        "Incline Range": "0-15%",
        "Running Surface": "152×51 cm",
        "Max User Weight": "180 kg",
      },
      features: [
        "Touch screen display",
        "Heart rate monitoring",
        "Pre-programmed workouts",
        "Bluetooth connectivity",
        "Emergency stop system",
      ],
      muscleGroups: ["Legs", "Glutes", "Core", "Cardio"],
      glbUrl: "/Treadmill_Genesis_9_0602091559_texture.glb ", // Placeholder for GLB model
    },
    {
      id: 2,
      name: "Multi-Station Cable Machine",
      category: "Strength",
      description:
        "Versatile cable machine with dual weight stacks for total body strength training.",
      specs: {
        "Weight Stacks": "2 × 100 kg",
        "Cable Travel": "2.1 m",
        Stations: "Multiple",
        Dimensions: "280×150×210 cm",
      },
      features: [
        "Dual adjustable pulleys",
        "Multiple handle attachments",
        "Safety weight locks",
        "Commercial grade cables",
        "360° rotating pulleys",
      ],
      muscleGroups: ["Full Body", "Arms", "Back", "Chest"],
      glbUrl: "/Cable_Machine_Station_0602102043_texture.glb",
    },
    {
      id: 3,
      name: "Olympic Squat Rack",
      category: "Free Weights",
      description:
        "Heavy-duty squat rack with safety bars and pull-up station for serious strength training.",
      specs: {
        "Max Load": "500 kg",
        "Bar Height": "Adjustable 51-122 cm",
        "Safety Bars": "Included",
        Frame: "Commercial Steel",
      },
      features: [
        "J-hooks with UHMW plastic",
        "Integrated pull-up bar",
        "Plate storage horns",
        "Safety spotter arms",
        "Band peg attachments",
      ],
      muscleGroups: ["Legs", "Glutes", "Core", "Full Body"],
      glbUrl: "/Squat_Rack_Essentials_0602102754_texture.glb",
    },
    {
      id: 4,
      name: "Adjustable Bench Press",
      category: "Free Weights",
      description:
        "Professional adjustable bench with multiple incline positions for comprehensive chest training.",
      specs: {
        Adjustments: "7 positions",
        "Max Weight": "300 kg",
        "Bench Length": "127 cm",
        "Seat Width": "30 cm",
      },
      features: [
        "Easy pop-pin adjustments",
        "Thick padded upholstery",
        "Non-slip foot plates",
        "Transport wheels",
        "Ladder style back pad",
      ],
      muscleGroups: ["Chest", "Shoulders", "Triceps", "Core"],
      glbUrl: "/Weight_Bench_Setup_0602103351_texture.glb",
    },
    {
      id: 5,
      name: "Leg Press Machine",
      category: "Strength",
      description:
        "45-degree leg press machine with large footplate for safe and effective leg training.",
      specs: {
        "Weight Capacity": "400 kg",
        Footplate: "61×41 cm",
        Angle: "45 degrees",
        "Range of Motion": "Full",
      },
      features: [
        "Large diamond-plate footplate",
        "Comfortable back pad",
        "Safety lock handles",
        "Weight horn storage",
        "Linear bearing system",
      ],
      muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
      glbUrl: "/Leg_Press_Machine_0602104153_texture.glb",
    },
    {
      id: 6,
      name: "Rowing Machine Elite",
      category: "Cardio",
      description:
        "Air resistance rowing machine with performance monitor for full-body cardio workouts.",
      specs: {
        Resistance: "Air + Magnetic",
        Monitor: "Performance PM5",
        "Max User Weight": "227 kg",
        Dimensions: "244×61×91 cm",
      },
      features: [
        "Flywheel design",
        "Ergonomic handle",
        "Adjustable footrests",
        "Quick-release framelock",
        "Device holder included",
      ],
      muscleGroups: ["Full Body", "Back", "Arms", "Legs"],
      glbUrl: "/Fitness_Machine_Appar_0602104620_texture.glb",
    },
    // Removed erroneous console.log(glbUrl, "glbUrl")
  ];

  // 3D Model Component (GLB Loader Only)
  const ModelViewer = ({ machine, isCard = false }) => {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);
    const modelRef = useRef(null);

    useEffect(() => {
      if (!mountRef.current || !machine.glbUrl) return;

      let loader;
      let cleanupModel = null;
      let isMounted = true;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(3, 2, 3);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // GLTF Loader (ESM import for Vite/React)
      import("three/examples/jsm/loaders/GLTFLoader")
        .then(({ GLTFLoader }) => {
          loader = new GLTFLoader();
          loader.load(
            machine.glbUrl.trim(),
            (gltf) => {
              if (!isMounted) return;
              const model = gltf.scene;
              model.traverse((child) => {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              modelRef.current = model;
              scene.add(model);
              cleanupModel = model;
            },
            undefined,
            (error) => {
              // eslint-disable-next-line no-console
              console.error("Error loading GLB model:", error);
            }
          );
        })
        .catch((err) => {
          console.error("Failed to load GLTFLoader:", err);
        });

      // Animation
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        if (modelRef.current) {
          modelRef.current.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (mountRef.current && renderer && camera) {
          camera.aspect =
            mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
          );
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        isMounted = false;
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (cleanupModel && scene) {
          scene.remove(cleanupModel);
        }
        renderer.dispose();
      };
    }, [machine]);

    // If no GLB, show fallback
    if (!machine.glbUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
          <span>No 3D model available</span>
        </div>
      );
    }

    return <div ref={mountRef} className="w-full h-full" />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleTutorialClick = (machine) => {
    alert(
      `Opening full workout tutorial for ${machine.name}!\n\nThis would typically navigate to a comprehensive guide with:\n• Proper form and technique\n• Step-by-step exercise instructions\n• Safety guidelines and precautions\n• Video demonstrations\n• Workout routines and progressions\n• Muscle activation diagrams\n• Equipment setup instructions`
    );
  };

  return (
    <div className="min-h-screen  bg-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          💪 Gym Equipment Gallery
        </h1>
        <p className="text-xl text-purple-200">
          Explore our collection of professional fitness equipment
        </p>
      </motion.div>

      {/* Machine Cards Grid */}
      <div className="container mx-auto px-6 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {machines.map((machine) => (
            <motion.div
              key={machine.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer border border-white/20 shadow-2xl"
              onClick={() => setSelectedMachine(machine)}
            >
              {/* 3D Model Viewer */}
              <div className="h-48 mb-4 bg-gray-100 rounded-xl overflow-hidden">
                <ModelViewer machine={machine} isCard={true} />
              </div>

              {/* Card Content */}
              <div className="text-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{machine.name}</h3>
                  <span className="bg-purple-500/50 px-3 py-1 rounded-full text-sm">
                    {machine.category}
                  </span>
                </div>
                <p className="text-purple-100 text-sm leading-relaxed">
                  {machine.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-purple-200 text-sm">
                    Click for details
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-lg">→</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedMachine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMachine(null);
              }
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl">
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedMachine.name}
                </h2>
                <p className="text-purple-100">{selectedMachine.category}</p>
              </div>

              <div className="p-6">
                {/* 3D Model Display */}
                <div className="h-64 mb-6 bg-gray-50 rounded-2xl overflow-hidden">
                  <ModelViewer machine={selectedMachine} />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMachine.description}
                  </p>
                </div>

                {/* Muscle Groups */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Target Muscle Groups
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMachine.muscleGroups.map((muscle, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedMachine.specs).map(
                      ([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <span className="font-semibold text-gray-700">
                            {key}:
                          </span>
                          <span className="ml-2 text-gray-600">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedMachine.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Tutorial Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTutorialClick(selectedMachine)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  🏋️ Open Full Workout Tutorial
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MachineGallery;
