import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

const AI_FACTS = [
  "Machine learning algorithms can now generate music that's nearly indistinguishable from human-created compositions.",
  "The term 'artificial intelligence' was first coined in 1956 at the Dartmouth Conference.",
  "GPT-4 has approximately 1.76 trillion parameters, making it one of the largest language models ever created.",
  "Self-driving cars use a combination of computer vision, LiDAR, and deep learning to navigate roads safely.",
  "AI systems still struggle with understanding context and causality in the way humans naturally do."
];

export function FactCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [fact, setFact] = useState("");
  
  useEffect(() => {
    // Randomly select a fact
    const randomFact = AI_FACTS[Math.floor(Math.random() * AI_FACTS.length)];
    setFact(randomFact);
    
    // Show the fact card after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-xs animate-float hidden sm:block z-10">
      <Card className="glass-card shadow-lg">
        <CardContent className="p-4">
          <h4 className="font-medium text-primary text-sm mb-1">AI Fact of the Day</h4>
          <p className="text-sm text-muted-foreground">{fact}</p>
          <button 
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
