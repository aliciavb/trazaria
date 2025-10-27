import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { seedDatabase, db } from '@/lib/db';
import Register from './Register';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Seed database on first load
      await seedDatabase();
      
      // Check if user has completed onboarding
      const profile = await db.profile.get('user-profile');
      
      if (!profile) {
        navigate('/onboarding');
      } else {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Register />
      <BottomNav />
    </>
  );
};

export default Index;
