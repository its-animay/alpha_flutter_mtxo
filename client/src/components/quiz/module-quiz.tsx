import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";

// Quiz question interface
export interface QuizQuestion {
  id: number;
  stem: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface ModuleQuizProps {
  moduleTitle: string;
  questions: QuizQuestion[];
  isInstructorView?: boolean;
}

export function ModuleQuiz({ moduleTitle, questions, isInstructorView = false }: ModuleQuizProps) {
  const { theme } = useTheme();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // Function to handle selection of an answer
  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Function to toggle explanation display for mobile
  const toggleExplanation = (questionId: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Calculate score if results are shown
  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="mx-auto w-full max-w-[600px] px-4 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">{moduleTitle}: Quiz</h2>
        <p className="text-muted-foreground">
          Test your knowledge by answering the following multiple-choice questions.
          {!isInstructorView && " Select the best answer for each question."}
        </p>
      </div>

      <Card className={cn(
        "backdrop-blur-sm border rounded-lg overflow-hidden",
        theme === "dark" 
          ? "bg-black/40 border-white/10 text-white" 
          : "bg-white/80 border-black/5 text-black"
      )}>
        <CardHeader className="px-6 py-5">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Module Assessment</span>
            {showResults && (
              <span className="text-base bg-primary/10 text-primary px-3 py-1 rounded-full">
                Score: {calculateScore()}/{questions.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <ScrollArea className="pr-4 -mr-4">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={cn(
                    "pb-6", 
                    index !== questions.length - 1 && "border-b",
                    theme === "dark" ? "border-white/20" : "border-black/10"
                  )}
                >
                  <div className="text-base font-medium mb-4">
                    {index + 1}. {question.stem}
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswers[question.id] === option.id;
                      const isCorrect = showResults && option.id === question.correctAnswer;
                      const isIncorrect = showResults && isSelected && option.id !== question.correctAnswer;
                      
                      return (
                        <div 
                          key={option.id}
                          className={cn(
                            "flex items-center p-3 rounded-md transition-colors",
                            isSelected ? "bg-primary/10 border border-primary/20" : "border hover:bg-muted",
                            isCorrect && "bg-green-500/10 border-green-500/30",
                            isIncorrect && "bg-red-500/10 border-red-500/30",
                            showResults ? "cursor-default" : "cursor-pointer"
                          )}
                          onClick={() => !showResults && handleSelectAnswer(question.id, option.id)}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                            isSelected ? "bg-primary text-white" : "border border-input",
                            isCorrect && "bg-green-500 text-white border-green-500",
                            isIncorrect && "bg-red-500 text-white border-red-500"
                          )}>
                            {isSelected && !isCorrect && !isIncorrect && <div className="w-2 h-2 bg-white rounded-full" />}
                            {isCorrect && <Check className="w-3 h-3" />}
                            {isIncorrect && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          
                          <div className="ml-3 flex-grow text-sm">
                            <span className="font-medium mr-1">{option.id}.</span> {option.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Explanation Section - Visible for instructor or when showing results */}
                  {(isInstructorView || showResults) && (
                    <div className="mt-4">
                      <div className="w-full">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="explanation" className={cn(
                            "border rounded-md",
                            theme === "dark" ? "border-white/20" : "border-black/10"
                          )}>
                            <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                              Show Explanation
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                  <span className="font-semibold">
                                    Correct Answer: {question.correctAnswer}
                                  </span>
                                  <p className="mt-1 text-muted-foreground">
                                    {question.explanation}
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {!isInstructorView && (
            <div className="mt-6 flex justify-end">
              {!showResults ? (
                <Button 
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length !== questions.length}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Submit Answers
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    setShowResults(false);
                    setSelectedAnswers({});
                  }}
                  variant="outline"
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}