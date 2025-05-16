import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, MessageSquare, Layers, Brain } from "lucide-react";

// Utility function to generate random number in range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

export function FuturisticHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const [matrixDrops, setMatrixDrops] = useState<{ id: number; x: number; delay: number; speed: number }[]>([]);
  const [blurObjects, setBlurObjects] = useState<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    delay: number; 
    duration: number;
    opacity: number;
    hue: number;
  }[]>([]);
  const [threeDObjects, setThreeDObjects] = useState<{
    id: number;
    x: number;
    y: number;
    scale: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    delay: number;
    duration: number;
    type: 'cube' | 'sphere' | 'pyramid' | 'ring';
    color: string;
  }[]>([]);
  
  // Generate matrix-like drops and blur objects for the background animation
  useEffect(() => {
    const numDrops = 30; // Number of "matrix-like" vertical drops
    const newDrops = Array.from({ length: numDrops }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 3, // Random delay for animation
      speed: 1 + Math.random() * 1.5, // Random speed for animation
    }));
    
    // Generate blur objects with various colors and sizes
    const numBlurObjects = 12;
    const newBlurObjects = Array.from({ length: numBlurObjects }, (_, i) => ({
      id: i,
      x: randomInRange(-5, 105), // Position may be slightly outside the container for partial visibility
      y: randomInRange(-20, 120), 
      size: randomInRange(30, 150), // Various sizes for depth effect
      delay: randomInRange(0, 2),
      duration: randomInRange(15, 40), // Slow movement
      opacity: randomInRange(0.05, 0.2), // Very subtle opacity
      hue: randomInRange(180, 260) // Blue to purple hues
    }));
    
    // Generate 3D objects that will float in the background
    const objectTypes: ('cube' | 'sphere' | 'pyramid' | 'ring')[] = ['cube', 'sphere', 'pyramid', 'ring'];
    const numThreeDObjects = 6; // Not too many to avoid clutter
    const newThreeDObjects = Array.from({ length: numThreeDObjects }, (_, i) => {
      // Decide on a random color from futuristic palette
      const colors = [
        'rgba(64, 121, 255, 0.2)',   // Blue
        'rgba(129, 30, 255, 0.2)',   // Purple
        'rgba(0, 217, 255, 0.2)',    // Cyan
        'rgba(255, 71, 200, 0.2)',   // Pink
        'rgba(0, 230, 175, 0.2)'     // Teal
      ];
      
      return {
        id: i,
        x: randomInRange(5, 95),
        y: randomInRange(10, 90),
        scale: randomInRange(0.2, 0.8),
        rotateX: randomInRange(0, 360),
        rotateY: randomInRange(0, 360),
        rotateZ: randomInRange(0, 360),
        delay: randomInRange(0, 3),
        duration: randomInRange(20, 40),
        type: objectTypes[Math.floor(Math.random() * objectTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    
    setMatrixDrops(newDrops);
    setBlurObjects(newBlurObjects);
    setThreeDObjects(newThreeDObjects);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 300);
  }, []);
  
  // Header container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // Logo animation
  const logoVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: "easeOut",
      }
    }
  };
  
  // Links animation
  const linkVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
      }
    }
  };
  
  // Matrix-like column animation
  const dropVariants = {
    initial: (custom: { speed: number; delay: number }) => ({
      opacity: 0.1 + Math.random() * 0.3,
      height: "10%",
      top: "-10%",
    }),
    animate: (custom: { speed: number; delay: number }) => ({
      top: "100%",
      transition: {
        duration: custom.speed,
        delay: custom.delay,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    })
  };
  
  // Logo text reveal animation
  const textVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%", 
      transition: { 
        duration: 1,
        ease: "easeInOut",
        delay: 0.5
      } 
    }
  };
  
  // Logo glow effect animation
  const glowVariants = {
    initial: { opacity: 0.2 },
    animate: { 
      opacity: [0.2, 0.5, 0.2], 
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // Blur object animation variants
  const blurObjectVariants = {
    initial: (custom: { delay: number, duration: number }) => ({
      x: "0%",
      y: "0%",
      opacity: 0,
      filter: "blur(8px)",
    }),
    animate: (custom: { delay: number, duration: number }) => ({
      x: ["0%", "10%", "-15%", "5%", "0%"],
      y: ["0%", "15%", "-5%", "-10%", "0%"],
      opacity: 1,
      filter: "blur(40px)",
      transition: {
        delay: custom.delay,
        duration: custom.duration,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    })
  };
  
  // 3D object animation variants
  const threeDObjectVariants = {
    initial: (custom: { delay: number, duration: number }) => ({
      opacity: 0,
      scale: 0.5,
      filter: "blur(4px)",
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    }),
    animate: (custom: { delay: number, duration: number }) => ({
      opacity: [0.4, 0.8, 0.4],
      scale: [0.8, 1.2, 0.8],
      filter: ["blur(2px)", "blur(4px)", "blur(2px)"],
      rotateX: [0, 180, 360],
      rotateY: [0, 360, 0],
      rotateZ: [0, -180, 0],
      transition: {
        delay: custom.delay,
        duration: custom.duration,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    })
  };
  
  // Icon hover animation
  const iconHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 300 
      }
    }
  };
  
  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background with matrix-like effect and blur objects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 3D Objects with animation */}
        {threeDObjects.map((obj) => {
          // Different shape for each type of 3D object
          let objectJSX;
          
          switch(obj.type) {
            case 'cube':
              objectJSX = (
                <div className="w-full h-full relative preserve-3d">
                  {/* Front face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform translate-z-[15px]" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Back face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform -translate-z-[15px]" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Left face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform -translate-x-[15px] rotate-y-90" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Right face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform translate-x-[15px] rotate-y-90" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Top face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform -translate-y-[15px] rotate-x-90" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Bottom face */}
                  <div className="absolute inset-0 border-2 border-opacity-50 transform translate-y-[15px] rotate-x-90" 
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                </div>
              );
              break;
            
            case 'sphere':
              objectJSX = (
                <div className="w-full h-full rounded-full border-2 border-opacity-50"
                  style={{
                    borderColor: obj.color.replace(/[^,]+\)/, '0.6)'),
                    background: obj.color,
                    boxShadow: `0 0 20px ${obj.color.replace(/[^,]+\)/, '0.4)')}`
                  }} />
              );
              break;
              
            case 'pyramid':
              objectJSX = (
                <div className="w-full h-full relative preserve-3d">
                  {/* Base */}
                  <div className="absolute bottom-0 left-0 right-0 border-2 border-opacity-50 transform-origin-bottom rotate-x-[70deg]"
                    style={{
                      borderColor: obj.color.replace(/[^,]+\)/, '0.6)'),
                      height: '70%',
                    }} />
                  {/* Front face */}
                  <div className="absolute bottom-0 left-[25%] right-[25%] h-full border-l-2 border-r-2 border-opacity-50 transform-origin-bottom rotate-x-[30deg]"
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Left face */}
                  <div className="absolute bottom-0 left-0 w-[50%] h-full border-l-2 border-r-2 border-opacity-50 transform-origin-bottom-right rotate-y-[30deg] rotate-x-[30deg]"
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                  {/* Right face */}
                  <div className="absolute bottom-0 right-0 w-[50%] h-full border-l-2 border-r-2 border-opacity-50 transform-origin-bottom-left -rotate-y-[30deg] rotate-x-[30deg]"
                    style={{borderColor: obj.color.replace(/[^,]+\)/, '0.6)')}} />
                </div>
              );
              break;
              
            case 'ring':
              objectJSX = (
                <div className="w-full h-full rounded-full border-4 border-opacity-60 flex items-center justify-center"
                  style={{
                    borderColor: obj.color.replace(/[^,]+\)/, '0.8)'),
                    boxShadow: `0 0 15px ${obj.color.replace(/[^,]+\)/, '0.5)')}`
                  }}>
                  <div className="w-[70%] h-[70%] rounded-full"
                    style={{
                      background: obj.color.replace(/[^,]+\)/, '0.3)'),
                    }} />
                </div>
              );
              break;
              
            default:
              objectJSX = <div className="w-full h-full rounded-full" style={{background: obj.color}} />;
          }
          
          return (
            <motion.div
              key={`3d-${obj.id}`}
              className="absolute"
              custom={{delay: obj.delay, duration: obj.duration}}
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${40 * obj.scale}px`,
                height: `${40 * obj.scale}px`,
                perspective: '400px',
              }}
              variants={threeDObjectVariants}
              initial="initial"
              animate="animate"
            >
              {objectJSX}
            </motion.div>
          );
        })}
        
        {/* Floating blur objects */}
        {blurObjects.map((obj) => (
          <motion.div
            key={`blur-${obj.id}`}
            className="absolute rounded-full"
            custom={{delay: obj.delay, duration: obj.duration}}
            style={{ 
              left: `${obj.x}%`, 
              top: `${obj.y}%`, 
              width: `${obj.size}px`, 
              height: `${obj.size}px`,
              background: `radial-gradient(circle, hsla(${obj.hue}, 80%, 60%, ${obj.opacity}) 0%, hsla(${obj.hue}, 70%, 50%, 0) 70%)`,
            }}
            variants={blurObjectVariants}
            initial="initial"
            animate="animate"
          />
        ))}
        
        {/* Matrix-like drops */}
        {matrixDrops.map((drop) => (
          <motion.div
            key={`matrix-${drop.id}`}
            className="absolute w-[1px] bg-primary/20 dark:bg-primary/40"
            custom={{speed: drop.speed, delay: drop.delay}}
            style={{ left: `${drop.x}%` }}
            variants={dropVariants}
            initial="initial"
            animate="animate"
          />
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background pointer-events-none" />
      </div>
      
      {/* Glass panel */}
      <div className="relative backdrop-blur-sm bg-background/60 dark:bg-background/40 border-b border-primary/5 dark:border-primary/10 supports-backdrop-blur:bg-background/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center space-x-3"
              variants={logoVariants}
            >
              <Link href="/dashboard">
                <motion.div 
                  className="relative flex items-center cursor-pointer" 
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Logo background glow */}
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 dark:from-primary/40 dark:to-primary/20 blur"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                  />
                  
                  {/* Logo icon */}
                  <motion.div 
                    className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/90 to-primary/70"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Brain className="h-5 w-5 text-white" />
                  </motion.div>
                  
                  {/* Logo text */}
                  <div className="ml-2 relative overflow-hidden">
                    <motion.div
                      className="font-bold text-xl flex items-center relative z-10 pb-0.5"
                      variants={textVariants}
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/90">
                        MTXO LABS
                      </span>
                    </motion.div>
                    
                    {/* Underline animation */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent dark:from-primary dark:to-primary/30"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.3, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Navigation Links - displayed on medium screens and up */}
            <motion.div 
              className="hidden md:flex items-center space-x-5"
              variants={linkVariants}
            >
              <AnimatePresence>
                {/* Dashboard Link */}
                <motion.div 
                  className="relative group"
                  variants={iconHoverVariants}
                  whileHover="hover"
                >
                  <Link href="/dashboard">
                    <div className="flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-primary/5 transition-colors">
                      <Layers className="h-4 w-4 text-primary/80" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </div>
                  </Link>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/50 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                {/* Profile Link */}
                <motion.div 
                  className="relative group"
                  variants={iconHoverVariants}
                  whileHover="hover"
                >
                  <Link href="/profile">
                    <div className="flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-primary/5 transition-colors">
                      <User className="h-4 w-4 text-primary/80" />
                      <span className="text-sm font-medium">Profile</span>
                    </div>
                  </Link>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/50 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                {/* Helpdesk Link */}
                <motion.div 
                  className="relative group"
                  variants={iconHoverVariants}
                  whileHover="hover"
                >
                  <Link href="/helpdesk">
                    <div className="flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-primary/5 transition-colors">
                      <MessageSquare className="h-4 w-4 text-primary/80" />
                      <span className="text-sm font-medium">Solve with Prof</span>
                    </div>
                  </Link>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/50 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Theme Toggle Button */}
            <motion.div
              variants={linkVariants}
              className="flex items-center"
            >
              <motion.div
                whileHover={{ 
                  rotate: 10,
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ThemeToggle />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}