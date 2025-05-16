import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useAnimation, useTransform, useScroll, useMotionValue } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { Brain } from "lucide-react";

export function AnimatedHeader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.7]);
  
  // Floating particles state
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    opacity: number;
  }[]>([]);
  
  // Circuit lines state
  const [circuitLines, setCircuitLines] = useState<{
    id: number;
    points: string;
    color: string;
    duration: number;
    delay: number;
  }[]>([]);
  
  // Initialize animations on mount
  useEffect(() => {
    // Generate floating particles
    const particleCount = 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.7 ? 'var(--primary)' : 'var(--primary-foreground)',
      speed: 15 + Math.random() * 25,
      opacity: 0.1 + Math.random() * 0.4
    }));
    setParticles(newParticles);
    
    // Generate circuit lines
    const lineCount = 8;
    const newLines = Array.from({ length: lineCount }, (_, i) => {
      // Create zigzag or curved circuit-like paths
      const startX = Math.random() * 25;
      const points = generateCircuitPath(startX);
      
      return {
        id: i,
        points,
        color: Math.random() > 0.5 ? 'var(--primary)' : 'var(--muted-foreground)',
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 5
      };
    });
    setCircuitLines(newLines);
    
    // Animate header in
    controls.start("visible");
    setMounted(true);
    
    return () => {
      controls.stop();
    };
  }, [controls]);
  
  // Generate a circuit-like SVG path
  const generateCircuitPath = (startX: number) => {
    let path = `M ${startX} 0`;
    let currentX = startX;
    let currentY = 0;
    const segmentCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < segmentCount; i++) {
      const moveRight = Math.random() > 0.5;
      const xDelta = 5 + Math.random() * 25;
      const yDelta = 5 + Math.random() * 15;
      
      currentX = moveRight ? currentX + xDelta : currentX;
      currentY = currentY + yDelta;
      
      if (i % 2 === 0) {
        // Add a line
        path += ` L ${currentX} ${currentY}`;
      } else {
        // Add a curve sometimes
        const cpX = currentX - (Math.random() * 20);
        path += ` Q ${cpX} ${currentY - yDelta/2} ${currentX} ${currentY}`;
      }
    }
    
    return path;
  };
  
  // Animation variants
  const headerVariants = {
    hidden: { 
      opacity: 0,
      y: -20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const logoVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.7, 
        ease: [0.19, 1.0, 0.22, 1.0]
      }
    }
  };
  
  const glowPulse = {
    initial: { 
      opacity: 0.6,
      filter: "blur(3px)"
    },
    animate: {
      opacity: [0.6, 1, 0.6],
      filter: ["blur(3px)", "blur(5px)", "blur(3px)"],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };
  
  // Text shine animation
  const shineVariants = {
    initial: { 
      backgroundPosition: "-200% 0"
    },
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 7,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  // Floating particle animation
  const floatVariants = {
    initial: (custom: { speed: number }) => ({
      y: 0,
      x: 0
    }),
    animate: (custom: { speed: number }) => ({
      y: [0, -20, 0, 10, 0],
      x: [0, 5, 10, 5, 0],
      transition: {
        duration: custom.speed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    })
  };
  
  // Circuit line animation (dash offset)
  const circuitVariants = {
    initial: { 
      pathLength: 0, 
      opacity: 0 
    },
    animate: (custom: { delay: number, duration: number }) => ({
      pathLength: 1,
      opacity: [0, 0.8, 0.2],
      transition: {
        pathLength: {
          duration: custom.duration,
          ease: "linear",
          delay: custom.delay,
          repeat: Infinity,
          repeatType: "loop" as const
        },
        opacity: {
          duration: custom.duration * 0.8,
          ease: "easeInOut",
          delay: custom.delay,
          repeat: Infinity,
          repeatType: "loop" as const
        }
      }
    })
  };
  
  return (
    <motion.header
      ref={headerRef}
      className="sticky top-0 z-50 w-full"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{ opacity }}
    >
      {/* Background with animated elements */}
      <div className="relative overflow-hidden h-16 sm:h-20">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
            transition: {
              duration: 15,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        
        {/* Circuit-like lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          {circuitLines.map((line) => (
            <motion.path
              key={line.id}
              d={line.points}
              stroke={line.color}
              strokeWidth="0.5"
              fill="none"
              variants={circuitVariants}
              initial="initial"
              animate="animate"
              custom={{ delay: line.delay, duration: line.duration }}
              style={{ 
                strokeDasharray: 1,
                strokeDashoffset: 1
              }}
            />
          ))}
        </svg>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity
            }}
            variants={floatVariants}
            initial="initial"
            animate="animate"
            custom={{ speed: particle.speed }}
          />
        ))}
        
        {/* Glass panel effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-background/30 dark:bg-background/20" />
        
        {/* Header content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo and title */}
          <Link href="/dashboard">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer group"
              variants={logoVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Logo background glow effect */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-primary/20 blur-lg"
                variants={glowPulse}
                initial="initial"
                animate="animate"
              />
              
              {/* Logo */}
              <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"
                  animate={{
                    x: ["200%", "-200%"],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }
                  }}
                />
                <Brain className="h-5 w-5 text-primary-foreground relative z-10" />
              </div>
              
              {/* Title */}
              <div className="flex flex-col">
                <motion.div
                  className="font-extrabold text-2xl tracking-wide relative overflow-hidden"
                  variants={shineVariants}
                  initial="initial"
                  animate="animate"
                  style={{
                    background: "linear-gradient(90deg, var(--primary) 0%, var(--primary) 45%, var(--primary-foreground) 50%, var(--primary) 55%, var(--primary) 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent"
                  } as any}
                >
                  MTXO LABS
                </motion.div>
                <motion.div 
                  className="h-[2px] w-full mt-0.5 bg-gradient-to-r from-primary/80 via-primary to-primary/80"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: 1, 
                    opacity: 1,
                    transition: { 
                      delay: 0.5, 
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }}
                />
              </div>
            </motion.div>
          </Link>
          
          {/* Navigation and theme toggle */}
          <div className="flex items-center space-x-6">
            {/* Navigation items - only shown on larger screens */}
            <div className="hidden md:flex space-x-6">
              <NavItem href="/dashboard" text="Dashboard" />
              <NavItem href="/profile" text="Profile" />
              <NavItem href="/helpdesk" text="Support" />
            </div>
            
            {/* Animated theme toggle */}
            <motion.div
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { type: "spring", stiffness: 500 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
        
        {/* Bottom border with animation */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>
      </div>
    </motion.header>
  );
}

// Navigation item component
function NavItem({ href, text }: { href: string; text: string }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Link href={href}>
        <div className="text-foreground/80 hover:text-primary transition-colors cursor-pointer text-sm font-medium">
          {text}
        </div>
      </Link>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/60"
        initial={{ scaleX: 0, originX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}