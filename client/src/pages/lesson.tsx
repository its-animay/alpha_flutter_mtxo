import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { 
  getCourseById, 
  type Course, 
  type CourseModule, 
  type CourseLessonItem 
} from "@/data/courses";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  ExternalLink,
  FileText,
  List,
  Lock,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  ThumbsUp,
} from "lucide-react";

export default function LessonPage() {
  const [match, params] = useRoute("/lesson/:courseId/:moduleId/:lessonId");
  const courseId = params?.courseId;
  const moduleId = params?.moduleId;
  const lessonId = params?.lessonId;
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>("content");
  
  const course = courseId ? getCourseById(courseId) : undefined;
  
  if (!course || !moduleId || !lessonId) {
    return <div className="p-8">Lesson not found</div>;
  }
  
  const currentModule = course.modules.find(m => m.id === moduleId);
  if (!currentModule) {
    return <div className="p-8">Module not found</div>;
  }
  
  const currentLesson = currentModule.lessons.find(l => l.id === lessonId);
  if (!currentLesson) {
    return <div className="p-8">Lesson not found</div>;
  }
  
  // Calculate previous and next lessons
  const flatLessons = course.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleId: module.id
    }))
  );
  
  const currentLessonIndex = flatLessons.findIndex(l => l.id === lessonId && l.moduleId === moduleId);
  const prevLesson = currentLessonIndex > 0 ? flatLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < flatLessons.length - 1 ? flatLessons[currentLessonIndex + 1] : null;
  
  // Calculate overall course progress from localStorage
  const totalLessons = flatLessons.length;
  const [completedLessons, setCompletedLessons] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Update completed lessons count from localStorage
  useEffect(() => {
    const updateCompletedLessonsCount = () => {
      const storedCompletedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      let count = 0;
      
      // Count lessons completed for this course
      flatLessons.forEach(lesson => {
        const lessonKey = `${courseId}-${lesson.moduleId}-${lesson.id}`;
        if (storedCompletedLessons[lessonKey]) {
          count++;
        }
      });
      
      setCompletedLessons(count);
      setProgressPercentage((count / totalLessons) * 100);
    };
    
    updateCompletedLessonsCount();
    
    // Add event listener to detect localStorage changes
    window.addEventListener('storage', updateCompletedLessonsCount);
    
    return () => {
      window.removeEventListener('storage', updateCompletedLessonsCount);
    };
  }, [courseId, flatLessons, totalLessons]);
  
  // Module completion state
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  
  // This would come from localStorage in a real implementation
  useEffect(() => {
    // Check if this lesson is marked as completed in localStorage
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
    const lessonKey = `${courseId}-${moduleId}-${lessonId}`;
    setIsModuleCompleted(!!completedLessons[lessonKey]);
  }, [courseId, moduleId, lessonId]);
  
  // Mark lesson as complete
  const markAsComplete = () => {
    const lessonKey = `${courseId}-${moduleId}-${lessonId}`;
    const completedLessonsObj = JSON.parse(localStorage.getItem('completedLessons') || '{}');
    completedLessonsObj[lessonKey] = true;
    localStorage.setItem('completedLessons', JSON.stringify(completedLessonsObj));
    
    // Update local state
    setIsModuleCompleted(true);
    setShowCompletionToast(true);
    
    // Update progress
    const newCompletedCount = completedLessons + 1;
    setCompletedLessons(newCompletedCount);
    setProgressPercentage((newCompletedCount / totalLessons) * 100);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowCompletionToast(false);
    }, 3000);
    
    // If all lessons are completed, show full completion message
    if (newCompletedCount === totalLessons) {
      setTimeout(() => {
        alert(`🎉 Congratulations! You've completed the entire "${course.title}" course!`);
      }, 1000);
    }
  };
  
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <Link href={`/courses/${courseId}`} className="flex items-center mr-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="hidden sm:inline-block font-medium">Back to Course</span>
          </Link>
          
          <div className="ml-auto flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link href="/dashboard">
                My Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Need Help?
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-80 border-r bg-card flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0 sm:w-0"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold truncate">{course.title}</h2>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <span>Your progress</span>
                  <span>{completedLessons}/{totalLessons} lessons</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
            
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-4 space-y-6">
                {course.modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <div className="font-medium">{module.title}</div>
                    
                    <div className="space-y-1 pl-1">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === lessonId && module.id === moduleId;
                        const lessonKey = `${courseId}-${module.id}-${lesson.id}`;
                        const storedCompletedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
                        const isCompleted = !!storedCompletedLessons[lessonKey];
                        
                        return (
                          <Link 
                            key={lesson.id} 
                            href={`/lesson/${courseId}/${module.id}/${lesson.id}`}
                          >
                            <div 
                              className={`flex items-center py-1 px-2 rounded-md text-sm
                                ${isActive ? 'bg-primary/10 text-primary font-medium' : 
                                  isCompleted ? 'bg-green-500/10 text-green-500' : 'hover:bg-muted/50'}
                              `}
                            >
                              {isCompleted ? (
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                              ) : isActive ? (
                                <PlayCircle className="h-4 w-4 mr-2 text-primary" />
                              ) : lesson.isFree ? (
                                <PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              
                              <span className="truncate flex-grow">{lesson.title}</span>
                              
                              <span className="text-xs text-muted-foreground ml-2 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.duration}m
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-card/50 p-6 border-b relative">
            {/* Module Header with completion status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                  ${isModuleCompleted 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-primary/20 text-primary'}`}
                >
                  {isModuleCompleted ? <Check className="h-5 w-5" /> : moduleId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentModule.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentModule.description}</p>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`px-3 py-1 
                  ${isModuleCompleted 
                    ? 'bg-green-500/20 text-green-500 border-green-500/20' 
                    : 'bg-primary/10 text-primary border-primary/20'}`}
              >
                {isModuleCompleted ? '✅ Completed' : '❌ Incomplete'}
              </Badge>
            </div>
            
            {/* Module progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>Your progress in this module</span>
                <span>Lesson {currentModule.lessons.findIndex(l => l.id === lessonId) + 1} of {currentModule.lessons.length}</span>
              </div>
              <Progress 
                value={(currentModule.lessons.findIndex(l => l.id === lessonId) + 1) / currentModule.lessons.length * 100} 
                className="h-2" 
              />
            </div>
            
            {/* Completion toast overlay (conditionally rendered) */}
            {showCompletionToast && (
              <div className="absolute top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 animate-fade-in">
                <Check className="h-4 w-4" />
                <span>Module marked as complete!</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="h-6">
                    Module {course.modules.findIndex(m => m.id === moduleId) + 1}, Lesson {currentModule.lessons.findIndex(l => l.id === lessonId) + 1}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentLesson.duration} minutes
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="sm:hidden"
                >
                  {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                </Button>
                
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-1 ${isModuleCompleted ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}`}
                  onClick={markAsComplete}
                  disabled={isModuleCompleted}
                >
                  {isModuleCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isModuleCompleted ? 'Completed' : 'Mark as Complete'}
                  </span>
                </Button>
              </div>
            </div>
            
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-none sm:flex">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="mt-4">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="mb-4 bg-primary/5 border border-primary/20 rounded-md p-4">
                      <h3 className="text-primary flex items-center gap-2 mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Module Overview
                      </h3>
                      <p className="mb-0">{currentLesson.description}</p>
                    </div>
                    
                    <h2 className="relative border-b pb-2">
                      <span className="text-primary">1.</span> Introduction to {currentModule.title}
                      <div className="absolute left-0 bottom-0 w-1/3 h-0.5 bg-primary"></div>
                    </h2>
                    
                    <p>In this lesson, we'll explore the fundamental concepts behind {course.title.toLowerCase()}. We'll cover the theoretical foundations and practical applications that make this subject crucial for modern AI systems.</p>
                    
                    <div className="bg-card border rounded-md p-4 my-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                        Key Takeaway
                      </h3>
                      <p className="mb-0">The fundamental principles covered in this module form the foundation for all advanced techniques we'll explore later in the course.</p>
                    </div>
                    
                    <h2 className="relative border-b pb-2">
                      <span className="text-primary">2.</span> Key Concepts
                      <div className="absolute left-0 bottom-0 w-1/3 h-0.5 bg-primary"></div>
                    </h2>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <div>
                          <strong>Understanding the core architecture</strong> - Learn how the underlying systems operate and interact.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <div>
                          <strong>Implementation strategies and best practices</strong> - Discover optimal approaches for real-world applications.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <div>
                          <strong>Performance optimization techniques</strong> - Learn how to improve efficiency and output quality.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                        <div>
                          <strong>Real-world applications and case studies</strong> - See how these concepts are applied in production environments.
                        </div>
                      </li>
                    </ul>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 my-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mt-0 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Important Note
                      </h3>
                      <p className="mb-0">When implementing these concepts, always consider the ethical implications and potential biases in your training data.</p>
                    </div>
                    
                    <h2 className="relative border-b pb-2">
                      <span className="text-primary">3.</span> Practical Implementation
                      <div className="absolute left-0 bottom-0 w-1/3 h-0.5 bg-primary"></div>
                    </h2>
                    
                    <p>Let's look at a practical example of how these concepts are applied in a real-world scenario.</p>
                    
                    <pre className="dark:bg-gray-900 dark:border dark:border-gray-800 bg-muted p-4 rounded-md overflow-x-auto shadow-md"><code className="dark:text-gray-300">{`# Example Python code
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model and tokenizer
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Generate text
input_text = "In this tutorial, we will learn how to"
input_ids = tokenizer.encode(input_text, return_tensors="pt")
output = model.generate(input_ids, max_length=50, num_return_sequences=1)

generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
print(generated_text)`}</code></pre>
                    
                    <h2 className="relative border-b pb-2">
                      <span className="text-primary">4.</span> Conclusion
                      <div className="absolute left-0 bottom-0 w-1/3 h-0.5 bg-primary"></div>
                    </h2>
                    
                    <p>By mastering these concepts, you'll be well-equipped to implement sophisticated AI solutions that leverage the power of {course.title.toLowerCase()} techniques.</p>
                    
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-6 my-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mt-0 text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        Summary
                      </h3>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                          <div>We explored the core principles behind {currentModule.title}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                          <div>Learned about implementation strategies and best practices</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                          <div>Examined a practical implementation example</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                          <div>Understood how to apply these concepts in real-world scenarios</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quiz Button */}
                    <div className="mt-8 mb-6">
                      <Button 
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link href={`/quiz/${courseId}/${moduleId}`}>
                          <div className="flex flex-col items-center justify-center py-2">
                            <div className="text-lg font-semibold mb-1">Ready to test your knowledge?</div>
                            <div className="text-sm opacity-90">Take the module quiz to check your understanding</div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Lesson navigation */}
                    <div className="flex justify-between items-center border-t pt-6 mt-8">
                      {prevLesson ? (
                        <Button variant="outline" asChild className="flex items-center gap-2">
                          <Link href={`/lesson/${courseId}/${prevLesson.moduleId}/${prevLesson.id}`}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous Lesson
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="flex items-center gap-2">
                          <ChevronLeft className="h-4 w-4" />
                          Previous Lesson
                        </Button>
                      )}
                      
                      <Button 
                        onClick={markAsComplete}
                        disabled={isModuleCompleted}
                        className={`${isModuleCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {isModuleCompleted ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                      
                      {nextLesson ? (
                        <Button variant="outline" asChild className="flex items-center gap-2">
                          <Link href={`/lesson/${courseId}/${nextLesson.moduleId}/${nextLesson.id}`}>
                            Next Lesson
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="flex items-center gap-2">
                          Next Lesson
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="resources" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Lesson Resources</h2>
                  
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {currentLesson.resources.map((resource) => (
                        <div key={resource.id} className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          {resource.type === 'pdf' && <FileText className="h-6 w-6 text-red-500" />}
                          {resource.type === 'code' && <Code className="h-6 w-6 text-blue-500" />}
                          {resource.type === 'link' && <ExternalLink className="h-6 w-6 text-green-500" />}
                          {resource.type === 'video' && <PlayCircle className="h-6 w-6 text-purple-500" />}
                          
                          <div>
                            <h3 className="font-medium">{resource.title}</h3>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center mt-1"
                            >
                              {resource.type === 'pdf' ? 'Download PDF' : 'View Resource'}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center border rounded-lg bg-muted/50">
                      <List className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No resources available</h3>
                      <p className="text-muted-foreground">
                        This lesson doesn't have any additional resources.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Supplementary Materials</h2>
                    <div className="space-y-2">
                      <a
                        href="#"
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <FileText className="h-5 w-5 text-primary" />
                        <span>Comprehensive Course Glossary</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <Code className="h-5 w-5 text-primary" />
                        <span>Code Repository for Course Examples</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-5 w-5 text-primary" />
                        <span>Recommended Reading List</span>
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Lesson Discussion</h2>
                  
                  <div className="p-6 text-center border rounded-lg bg-muted/50">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Join the conversation</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions, share insights, and connect with other students.
                    </p>
                    <Button className="primary-btn">
                      Start a Discussion
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Separator />
          
          <div className="p-4 flex items-center justify-between border-t">
            {prevLesson ? (
              <Button 
                variant="outline" 
                asChild 
                className="gap-2"
              >
                <Link href={`/lesson/${courseId}/${prevLesson.moduleId}/${prevLesson.id}`}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous Lesson</span>
                </Link>
              </Button>
            ) : (
              <div></div>
            )}
            
            {nextLesson ? (
              <Button 
                asChild 
                className="gap-2 primary-btn"
              >
                <Link href={`/lesson/${courseId}/${nextLesson.moduleId}/${nextLesson.id}`}>
                  <span className="hidden sm:inline">Next Lesson</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button className="gap-2 primary-btn">
                <span>Complete Course</span>
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}