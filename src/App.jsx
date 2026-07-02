import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import LoadScreen from "./components/LoadScreen";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import Grain from "./components/Grain";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <ScrollProgress />
      <CursorGlow />
      <Grain />
      <Hero />
      <Projects />
      <Contact />
    </>
  );
}
