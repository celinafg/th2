import { WendiFileUploaderWithOrbits } from './components';
import './App.css';
import { AnimatePresence } from 'motion/react';

const App = () => {
  const handleFilesChange = (files) => {
    console.log('Files changed:', files);
  };

  return (
    <div className="App">
      <AnimatePresence>
        <WendiFileUploaderWithOrbits onFilesChange={handleFilesChange} loadingDuration={1500} />
      </AnimatePresence>
    </div>
  );
};

export default App;
