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
    <div className="mx-auto w-full px-4 sm:px-6 lg:max-w-[900px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6">{moduleTitle}: Quiz</h2>
        <p className="text-muted-foreground">
          Test your knowledge by answering the following multiple-choice questions.
          {!isInstructorView && " Select the best answer for each question."}
        </p>
      </div>

      <Card className={cn(
        "backdrop-blur-sm border rounded-lg overflow-hidden shadow-lg",
        theme === "dark" 
          ? "bg-gradient-to-b from-gray-900/90 to-black/90 border-purple-500/20 text-white" 
          : "bg-white/90 border-black/5 text-black"
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
            <div className="space-y-8 lg:space-y-10">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={cn(
                    "pb-6", 
                    index !== questions.length - 1 && "border-b",
                    theme === "dark" ? "border-white/20" : "border-black/10"
                  )}
                >
                  <div className="text-base lg:text-lg font-medium mb-4 lg:mb-5">
                    <span className="lg:text-xl lg:font-semibold text-primary">{index + 1}.</span> {question.stem}
                  </div>
                  
                  <div className="space-y-2 lg:space-y-3 lg:pt-2">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswers[question.id] === option.id;
                      const isCorrect = showResults && option.id === question.correctAnswer;
                      const isIncorrect = showResults && isSelected && option.id !== question.correctAnswer;
                      
                      return (
                        <div 
                          key={option.id}
                          className={cn(
                            "flex items-center p-3 lg:p-4 rounded-md transition-all duration-200",
                            theme === "dark" 
                              ? isSelected 
                                ? "bg-primary/20 border border-primary/40 shadow-[0_0_10px_rgba(0,200,255,0.15)]" 
                                : "border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                              : isSelected 
                                ? "bg-primary/10 border border-primary/20" 
                                : "border hover:bg-muted",
                            isCorrect && theme === "dark" 
                              ? "bg-green-500/20 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                              : isCorrect && "bg-green-500/10 border-green-500/30",
                            isIncorrect && theme === "dark" 
                              ? "bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                              : isIncorrect && "bg-red-500/10 border-red-500/30",
                            showResults ? "cursor-default" : "cursor-pointer"
                          )}
                          onClick={() => !showResults && handleSelectAnswer(question.id, option.id)}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                            theme === "dark"
                              ? isSelected 
                                ? "bg-primary text-white border-primary shadow-[0_0_6px_rgba(0,200,255,0.4)]" 
                                : "border border-gray-600"
                              : isSelected 
                                ? "bg-primary text-white" 
                                : "border border-input",
                            isCorrect && theme === "dark"
                              ? "bg-green-500 text-white border-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                              : isCorrect && "bg-green-500 text-white border-green-500",
                            isIncorrect && theme === "dark"
                              ? "bg-red-500 text-white border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                              : isIncorrect && "bg-red-500 text-white border-red-500"
                          )}>
                            {isSelected && !isCorrect && !isIncorrect && <div className="w-2 h-2 bg-white rounded-full" />}
                            {isCorrect && <Check className="w-3 h-3" />}
                            {isIncorrect && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          
                          <div className="ml-3 flex-grow text-sm lg:text-base">
                            <span className="font-medium mr-1 text-primary">{option.id}.</span> {option.text}
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
                            "border rounded-md transition-all duration-200",
                            theme === "dark" 
                              ? "border-purple-500/30 bg-gray-900/40" 
                              : "border-primary/10 bg-primary/5"
                          )}>
                            <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                              Show Explanation
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className={cn(
                                "flex items-start gap-2 p-3 rounded-md",
                                theme === "dark" 
                                  ? "bg-gray-800/50 border border-purple-600/20" 
                                  : "bg-primary/5 border border-primary/10"
                              )}>
                                <Info className={cn(
                                  "w-4 h-4 mt-0.5 flex-shrink-0",
                                  theme === "dark" ? "text-purple-400" : "text-primary"
                                )} />
                                <div className="text-sm">
                                  <span className={cn(
                                    "font-semibold",
                                    theme === "dark" ? "text-purple-300" : "text-primary"
                                  )}>
                                    Correct Answer: {question.correctAnswer}
                                  </span>
                                  <p className={cn(
                                    "mt-1",
                                    theme === "dark" ? "text-gray-300" : "text-muted-foreground"
                                  )}>
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
                  className={cn(
                    "transition-all duration-300 text-white",
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                      : "bg-primary hover:bg-primary/90"
                  )}
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
                  className={cn(
                    "transition-all duration-300",
                    theme === "dark" 
                      ? "border-purple-500/40 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200" 
                      : ""
                  )}
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