import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Flame, Star, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface GamifiedProgressProps {
  progress: number;
  level?: number;
  streakDays?: number;
  xp?: number;
  maxXp?: number;
  achievements?: Achievement[];
  className?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "star" | "trophy" | "flame" | "zap" | "award";
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

export function GamifiedProgress({
  progress,
  level = 1,
  streakDays = 0,
  xp = 0,
  maxXp = 100,
  achievements = [],
  className
}: GamifiedProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  
  // Animate progress bar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [progress]);
  
  // Calculate user level based on experience points
  const levelPercentage = (xp / maxXp) * 100;
  
  // Icon mapping for achievements
  const iconMap = {
    star: <Star className="h-5 w-5" />,
    trophy: <Trophy className="h-5 w-5" />,
    flame: <Flame className="h-5 w-5" />,
    zap: <Zap className="h-5 w-5" />,
    award: <Award className="h-5 w-5" />
  };
  
  // Trigger level up animation
  const triggerLevelUp = () => {
    setShowLevelUpAnimation(true);
    setTimeout(() => setShowLevelUpAnimation(false), 3000);
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Progress */}
      <div className="mb-6 relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Your Learning Journey</h3>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{progress}%</span> Complete
          </div>
        </div>
        
        {/* Main progress bar with animated fill */}
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary absolute top-0 left-0"
            initial={{ width: "0%" }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              delay: 0.2
            }}
          />
          
          {/* Milestones on the progress bar */}
          {[25, 50, 75].map(milestone => (
            <div 
              key={`milestone-${milestone}`}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-colors z-10",
                progress >= milestone 
                  ? "bg-white border-white" 
                  : "bg-muted border-muted-foreground/30"
              )}
              style={{ left: `${milestone}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Level and XP */}
      <div className="bg-card/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="font-bold">{level}</span>
            </div>
            <div>
              <h4 className="font-semibold">Level {level}</h4>
              <p className="text-xs text-muted-foreground">Keep learning to level up!</p>
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium">{xp}/{maxXp} XP</span>
          </div>
        </div>
        
        {/* XP progress bar */}
        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-secondary"
            initial={{ width: "0%" }}
            animate={{ width: `${levelPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Learning Streak */}
      <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-semibold">Learning Streak</h4>
          <div className="flex items-center gap-1">
            <motion.span
              className="font-bold text-lg"
              key={streakDays}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {streakDays}
            </motion.span> 
            <span className="text-muted-foreground">days</span>
          </div>
        </div>
        
        {/* Streak visualization */}
        <div className="flex-grow flex items-center justify-end gap-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const isActive = i < (streakDays % 7);
            return (
              <motion.div 
                key={`streak-${i}`}
                className={cn(
                  "w-2 rounded-full",
                  isActive ? "bg-orange-500" : "bg-muted"
                )}
                style={{ 
                  height: isActive ? `${12 + (i * 3)}px` : "8px",
                }}
                initial={{ height: "8px" }}
                animate={{ 
                  height: isActive ? `${12 + (i * 3)}px` : "8px",
                  opacity: isActive ? 1 : 0.4
                }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map(achievement => (
              <motion.div
                key={achievement.id}
                className={cn(
                  "p-3 rounded-lg flex items-center gap-3",
                  achievement.completed 
                    ? "bg-primary/10 dark:bg-primary/20" 
                    : "bg-muted/50"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    achievement.completed 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {iconMap[achievement.icon]}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "font-medium",
                      achievement.completed ? "" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h4>
                    {achievement.completed && (
                      <motion.div 
                        className="text-xs bg-primary text-white px-1.5 py-0.5 rounded"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 15
                        }}
                      >
                        Unlocked
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  
                  {/* Achievement progress bar (if applicable) */}
                  {!achievement.completed && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                    <div className="mt-1.5 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary/50"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Level up animation overlay */}
      {showLevelUpAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl font-bold text-primary mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: 1 }}
            >
              LEVEL UP!
            </motion.div>
            <motion.div
              className="text-2xl"
              animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, times: [0, 0.5, 1] }}
            >
              You reached Level {level}!
            </motion.div>
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                className="px-6 py-2 bg-primary text-white rounded-full"
                onClick={() => setShowLevelUpAnimation(false)}
              >
                Continue Learning
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}