import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { 
  getCourseById, 
  type Course, 
  type CourseModule, 
  type CourseLessonItem 
} from "@/data/courses";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
  
  // Calculate overall course progress - in a real app this would come from the user's progress data
  const totalLessons = flatLessons.length;
  const completedLessons = 0; // This would be fetched from user data
  const progressPercentage = (completedLessons / totalLessons) * 100;
  
  // Video states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoVolume, setVideoVolume] = useState(1);
  
  // Simulated video URL
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  
  // Toggle video play/pause
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  // Update video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };
  
  // Jump to position in video
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
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
          
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link href="/dashboard">
                My Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Need Help?
            </Button>
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
                        const isCompleted = false; // This would come from user data
                        
                        return (
                          <Link 
                            key={lesson.id} 
                            href={`/lesson/${courseId}/${module.id}/${lesson.id}`}
                          >
                            <div 
                              className={`flex items-center py-1 px-2 rounded-md text-sm
                                ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50'}
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
          <div className="bg-black aspect-video relative">
            <video
              ref={videoRef}
              className="w-full h-full"
              src={videoSrc}
              poster="https://placehold.co/1200x675/1a202c/e2e8f0?text=Video+Thumbnail"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            />
            
            {/* Video controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end">
              {/* Progress bar */}
              <div 
                className="w-full h-2 bg-gray-700 cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              
              {/* Controls */}
              <div className="p-4 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white"
                  onClick={toggleVideoPlayback}
                >
                  {isVideoPlaying ? (
                    <div className="h-5 w-5 bg-white/20 rounded-md" />
                  ) : (
                    <PlayCircle className="h-5 w-5" />
                  )}
                </Button>
                
                {/* Playback rate dropdown would go here */}
                
                <div className="ml-auto flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white text-xs rounded-full px-3 py-1 bg-white/10"
                  >
                    HD
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white text-xs rounded-full px-3 py-1 bg-white/10"
                  >
                    1x
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white text-xs rounded-full px-3 py-1 bg-white/10"
                  >
                    CC
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white ml-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M12 12v.01" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
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
                
                <Button variant="outline" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark as Complete</span>
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
                    <p>{currentLesson.description}</p>
                    
                    {/* Simulated lesson content */}
                    <h2>Overview</h2>
                    <p>In this lesson, we'll explore the fundamental concepts behind {course.title.toLowerCase()}. We'll cover the theoretical foundations and practical applications that make this subject crucial for modern AI systems.</p>
                    
                    <h2>Key Concepts</h2>
                    <ul>
                      <li>Understanding the core architecture</li>
                      <li>Implementation strategies and best practices</li>
                      <li>Performance optimization techniques</li>
                      <li>Real-world applications and case studies</li>
                    </ul>
                    
                    <h2>Practical Implementation</h2>
                    <p>Let's look at a practical example of how these concepts are applied in a real-world scenario.</p>
                    
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code>{`# Example Python code
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
                    
                    <h2>Conclusion</h2>
                    <p>By mastering these concepts, you'll be well-equipped to implement sophisticated AI solutions that leverage the power of {course.title.toLowerCase()} techniques.</p>
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