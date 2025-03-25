import { useState, useEffect } from 'react';
import { Plus, Clock } from 'lucide-react';
import { TimerList } from './components/TimerList';
import { TimerModal } from './components/TimerModal';
import { Toaster } from 'sonner';
import { Button } from './components/Button';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position={isMobile ? 'bottom-center' : 'top-right'} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Timer</h1>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
          >
            Add Timer
          </Button>
        </div>
        
        <TimerList />
        
        <TimerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default Home;