import React, { useState, useEffect } from "react";
import MachineGallery from "./Components/Card";
import LoadingScreen from "./Components/LoadingScreen";

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading (e.g. model load or image preload)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Replace with real loading logic
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading && <LoadingScreen />}
      {!loading && <MachineGallery />}
    </div>
  );
};

export default App;
