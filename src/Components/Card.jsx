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
      location: "Cardio Zone - Row A",
      description:
        "Our state-of-the-art treadmill features advanced shock absorption for comfortable running and walking workouts.",
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
      glbUrl: "/Treadmill_Genesis_9_0602091559_texture.glb",
      difficulty: "Beginner to Advanced",
      availability: "Available",
    },
    {
      id: 2,
      name: "Multi-Station Cable Machine",
      category: "Strength",
      location: "Strength Zone - Center",
      description:
        "Versatile cable machine perfect for functional training and targeting multiple muscle groups simultaneously.",
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
      difficulty: "Intermediate to Advanced",
      availability: "Available",
    },
    {
      id: 3,
      name: "Olympic Squat Rack",
      category: "Free Weights",
      location: "Free Weight Area - Station 1",
      description:
        "Heavy-duty squat rack designed for serious strength training with integrated safety features.",
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
      difficulty: "Intermediate to Advanced",
      availability: "Available",
    },
    {
      id: 4,
      name: "Adjustable Bench Press",
      category: "Free Weights",
      location: "Free Weight Area - Station 2",
      description:
        "Professional adjustable bench perfect for chest development and upper body strength training.",
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
      difficulty: "Beginner to Advanced",
      availability: "Available",
    },
    {
      id: 5,
      name: "Leg Press Machine",
      category: "Strength",
      location: "Strength Zone - Corner",
      description:
        "45-degree leg press machine designed for safe and effective lower body strength development.",
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
      difficulty: "Beginner to Advanced",
      availability: "Available",
    },
    {
      id: 6,
      name: "Rowing Machine Elite",
      category: "Cardio",
      location: "Cardio Zone - Row B",
      description:
        "Premium rowing machine offering full-body cardio workout with performance tracking capabilities.",
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
      difficulty: "Beginner to Advanced",
      availability: "Available",
    },
  ];

  // 3D Model Component
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
      // Gym-like background color
      scene.background = new THREE.Color(0xf8f9fa);

      const camera = new THREE.PerspectiveCamera(
        45,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(4, 3, 4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Gym-style lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
      mainLight.position.set(8, 10, 5);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(-5, 3, -5);
      scene.add(fillLight);

      // Subtle floor for context
      const floorGeometry = new THREE.PlaneGeometry(15, 15);
      const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.08 });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.5;
      floor.receiveShadow = true;
      scene.add(floor);

      // GLTF Loader
      import("three/examples/jsm/loaders/GLTFLoader")
        .then(({ GLTFLoader }) => {
          loader = new GLTFLoader();
          loader.load(
            machine.glbUrl.trim(),
            (gltf) => {
              if (!isMounted) return;
              const model = gltf.scene;

              // Center and scale the model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());

              model.position.sub(center);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 2.5 / maxDim;
              model.scale.setScalar(scale);

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
          modelRef.current.rotation.y += 0.008;
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

    if (!machine.glbUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">🏋️</span>
          </div>
          <span className="text-sm font-medium">Equipment Preview</span>
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
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
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

  const handleWorkoutGuide = (machine) => {
    alert(
      `Opening workout guide for ${machine.name}!\n\nThis guide includes:\n• Proper setup and adjustment\n• Correct form and technique\n• Beginner to advanced exercises\n• Safety guidelines\n• Muscle targeting tips\n• Common mistakes to avoid\n• Workout progression plans`
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Cardio":
        return "❤️";
      case "Strength":
        return "💪";
      case "Free Weights":
        return "🏋️";
      default:
        return "⚡";
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes("Beginner")) return "bg-green-100 text-green-800";
    if (difficulty.includes("Intermediate"))
      return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Gym Introduction Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          🏋️ Our Gym Equipment
        </h1>
        <p className="text-xl text-blue-200 max-w-3xl mx-auto px-4">
          Discover the professional-grade equipment available at our fitness
          facility. Each machine is carefully selected to help you achieve your
          fitness goals safely and effectively.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-blue-200">
          <span className="bg-white/10 px-4 py-2 rounded-full">
            ✨ State-of-the-art equipment
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-full">
            🛡️ Safety certified
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-full">
            📱 Smart technology
          </span>
        </div>
      </motion.div>

      {/* Equipment Showcase Grid */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {machines.map((machine) => (
            <motion.div
              key={machine.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300"
              onClick={() => setSelectedMachine(machine)}
            >
              {/* 3D Equipment Preview */}
              <div className="h-56 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
                <ModelViewer machine={machine} isCard={true} />

                {/* Equipment Status */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    {machine.availability}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <span className="mr-1">
                      {getCategoryIcon(machine.category)}
                    </span>
                    {machine.category}
                  </span>
                </div>
              </div>

              {/* Equipment Information */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {machine.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    📍 {machine.location}
                  </p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {machine.description}
                </p>

                {/* Difficulty Level */}
                <div className="mb-4">
                  <span
                    className={`${getDifficultyColor(
                      machine.difficulty
                    )} px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {machine.difficulty}
                  </span>
                </div>

                {/* Quick Info */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {machine.muscleGroups.length}
                    </span>{" "}
                    muscle groups
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, x: 5 }}
                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <span className="text-white text-lg font-bold">→</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Equipment Details Modal */}
      <AnimatePresence>
        {selectedMachine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-8 bg-gradient-to-r from-slate-800 to-blue-800 text-white rounded-t-3xl">
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <span className="text-xl">✕</span>
                </button>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-4xl font-bold mb-3">
                      {selectedMachine.name}
                    </h2>
                    <div className="flex items-center gap-4 text-blue-200">
                      <span className="flex items-center">
                        {getCategoryIcon(selectedMachine.category)}{" "}
                        {selectedMachine.category}
                      </span>
                      <span>📍 {selectedMachine.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {selectedMachine.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* 3D Equipment Display */}
                <div className="h-80 mb-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden shadow-inner">
                  <ModelViewer machine={selectedMachine} />
                </div>

                {/* Equipment Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    {/* About This Equipment */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        About This Equipment
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        {selectedMachine.description}
                      </p>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <span className="text-blue-800 font-semibold">
                          Difficulty Level:{" "}
                        </span>
                        <span
                          className={`${getDifficultyColor(
                            selectedMachine.difficulty
                          )} px-3 py-1 rounded-full text-sm font-semibold ml-2`}
                        >
                          {selectedMachine.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Target Muscles */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        Muscle Groups Targeted
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedMachine.muscleGroups.map((muscle, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-red-50 to-red-100 text-red-800 px-4 py-3 rounded-xl text-center font-semibold border border-red-200"
                          >
                            {muscle}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Equipment Specifications */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        Equipment Specifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedMachine.specs).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center"
                            >
                              <span className="font-semibold text-gray-800">
                                {key}
                              </span>
                              <span className="text-gray-600 font-medium">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        Key Features
                      </h3>
                      <div className="space-y-3">
                        {selectedMachine.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-green-50 p-3 rounded-xl border border-green-200"
                          >
                            <span className="text-green-500 mr-3 text-xl">
                              ✓
                            </span>
                            <span className="text-gray-800 font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleWorkoutGuide(selectedMachine)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="mr-3">📚</span>
                    View Complete Workout Guide
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MachineGallery;
