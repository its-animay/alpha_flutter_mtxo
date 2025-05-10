import { useTheme } from "@/components/ui/theme-provider";
import CosmicMesh from "@/assets/cosmic-neural-mesh.svg";

export function ParticleBackground() {
  const { theme } = useTheme();
  
  return (
    <div 
      className="fixed inset-0 z-[-1] transition-all duration-700"
      style={{
        backgroundImage: theme === 'dark' 
          ? `url(${CosmicMesh}), radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 90%)`
          : 'linear-gradient(135deg, hsl(var(--light-bg-start)) 0%, hsl(var(--light-bg-end)) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: theme === 'dark' ? 'soft-light' : 'normal',
      }}
    />
  );
}
