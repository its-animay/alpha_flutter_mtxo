import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { ModuleQuiz, QuizQuestion } from "@/components/quiz/module-quiz";
import { getCourseById } from "@/data/courses";
import { ParticleBackground } from "@/components/particle-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

// Module 1 quiz questions
const module1Questions: QuizQuestion[] = [
  {
    id: 1,
    stem: "What is the primary purpose of transformer models in NLP?",
    options: [
      { id: "A", text: "To transform text between languages" },
      { id: "B", text: "To compress text data for storage" },
      { id: "C", text: "To learn contextual relationships between words" },
      { id: "D", text: "To replace traditional databases for text storage" }
    ],
    correctAnswer: "C",
    explanation: "Transformer models revolutionized NLP by effectively capturing contextual relationships between words in a sequence through their self-attention mechanism, allowing them to understand language context better than previous models."
  },
  {
    id: 2,
    stem: "Which component is the key innovation in transformer architecture?",
    options: [
      { id: "A", text: "Recurrent neural networks" },
      { id: "B", text: "Self-attention mechanism" },
      { id: "C", text: "Convolutional layers" },
      { id: "D", text: "Long short-term memory units" }
    ],
    correctAnswer: "B",
    explanation: "The self-attention mechanism is the breakthrough innovation in transformer architecture, allowing the model to weigh the importance of different words in a sequence regardless of their positional distance."
  },
  {
    id: 3,
    stem: "What advantage do transformers have over RNNs when processing text?",
    options: [
      { id: "A", text: "They require less computational power" },
      { id: "B", text: "They can only process short sequences" },
      { id: "C", text: "They process words sequentially" },
      { id: "D", text: "They can process all words in parallel" }
    ],
    correctAnswer: "D",
    explanation: "Unlike RNNs which process text sequentially (word by word), transformers can process all words in a sequence simultaneously in parallel, making them significantly faster to train and more efficient."
  },
  {
    id: 4,
    stem: "In the context of transformer models, what does 'attention' refer to?",
    options: [
      { id: "A", text: "The model's ability to focus on user commands" },
      { id: "B", text: "A technique to filter out irrelevant information" },
      { id: "C", text: "The process of weighing relationships between words" },
      { id: "D", text: "A method to compress input data" }
    ],
    correctAnswer: "C",
    explanation: "In transformers, attention is a mechanism that weighs the relationships between words in a sequence, allowing the model to focus on relevant parts of the input when generating each part of the output."
  },
  {
    id: 5,
    stem: "Which of the following is NOT a common application of transformer models?",
    options: [
      { id: "A", text: "Text summarization" },
      { id: "B", text: "Machine translation" },
      { id: "C", text: "Low-level hardware optimization" },
      { id: "D", text: "Question answering systems" }
    ],
    correctAnswer: "C",
    explanation: "While transformers excel at NLP tasks like summarization, translation, and question answering, they are not typically used for low-level hardware optimization, which requires different computational approaches and specialized algorithms."
  }
];

export default function ModuleQuizPage() {
  const params = useParams();
  const { courseId, moduleId } = params;
  const [isInstructorView, setIsInstructorView] = useState(false);
  
  // Get course and module data
  const course = getCourseById(courseId || "");
  const module = course?.modules.find(m => m.id === moduleId);
  
  if (!course || !module) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Module not found</h1>
        <Button asChild variant="default">
          <Link href="/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative pb-16">
      <ParticleBackground />
      
      <div className="container mx-auto pt-8 px-4 relative z-10">
        <div className="flex flex-col items-start mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href={`/lesson/${courseId}/${moduleId}/${module.lessons[0].id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
          
          <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <ThemeToggle />
              
              {/* Toggle for instructor view */}
              <Button 
                variant="outline" 
                onClick={() => setIsInstructorView(!isInstructorView)}
                className="text-xs md:text-sm"
              >
                {isInstructorView ? "Student View" : "Instructor View"}
              </Button>
            </div>
          </div>
        </div>
        
        <ModuleQuiz 
          moduleTitle={module.title}
          questions={module1Questions}
          isInstructorView={isInstructorView}
        />
      </div>
    </div>
  );
}