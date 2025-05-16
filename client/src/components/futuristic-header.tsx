import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, MessageSquare, Layers, Brain } from "lucide-react";

export function FuturisticHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const [matrixDrops, setMatrixDrops] = useState<{ id: number; x: number; delay: number; speed: number }[]>([]);
  
  // Generate matrix-like drops for the background animation
  useEffect(() => {
    const numDrops = 30; // Number of "matrix-like" vertical drops
    const newDrops = Array.from({ length: numDrops }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position
      delay: Math.random() * 3, // Random delay for animation
      speed: 1 + Math.random() * 1.5, // Random speed for animation
    }));
    
    setMatrixDrops(newDrops);
    
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
      {/* Background with matrix-like effect */}
      <div className="absolute inset-0 overflow-hidden">
        {matrixDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-[1px] bg-primary/20 dark:bg-primary/40"
            custom={{speed: drop.speed, delay: drop.delay}}
            style={{ left: `${drop.x}%` }}
            variants={dropVariants}
            initial="initial"
            animate="animate"
          />
        ))}
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