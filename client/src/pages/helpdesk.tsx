import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { ParticleBackground } from "@/components/particle-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  File, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Play, 
  Square, 
  Clock, 
  CheckCheck, 
  Search,
  MessageSquare,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for instructors and courses
const mockCourses = [
  {
    id: "1",
    title: "Agentic LLMs Bootcamp",
    instructors: [
      {
        id: 101,
        name: "Dr. Alan Chen",
        avatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        status: "online", // online, offline, away
        lastActive: new Date(),
      },
      {
        id: 102,
        name: "Dr. Maria Rodriguez",
        avatar: "https://placehold.co/200/e5468e/ffffff?text=MR",
        status: "offline",
        lastActive: new Date(Date.now() - 3600000), // 1 hour ago
      }
    ]
  },
  {
    id: "2",
    title: "MLOps Engineering Professional",
    instructors: [
      {
        id: 103,
        name: "Prof. James Wilson",
        avatar: "https://placehold.co/200/46e58e/ffffff?text=JW",
        status: "away",
        lastActive: new Date(Date.now() - 900000), // 15 minutes ago
      }
    ]
  }
];

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    courseId: "1",
    instructorId: 101,
    messages: [
      {
        id: 1,
        senderId: 101, // instructor
        senderName: "Dr. Alan Chen",
        senderAvatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        messageType: "text",
        content: "Hello! How can I help you with your questions about Agentic LLMs?",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isRead: true,
      },
      {
        id: 2,
        senderId: 999, // current user
        senderName: "You",
        messageType: "text",
        content: "Hi Dr. Chen, I'm having trouble understanding the difference between ReAct and Reflexion patterns. Could you explain the key differences?",
        timestamp: new Date(Date.now() - 82800000), // 23 hours ago
        isRead: true,
      },
      {
        id: 3,
        senderId: 101,
        senderName: "Dr. Alan Chen",
        senderAvatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        messageType: "text",
        content: "Great question! ReAct and Reflexion are both important patterns for agentic systems. ReAct (Reasoning + Acting) combines reasoning traces with actions, allowing the agent to plan and execute steps with a reasoning component before each action. Reflexion, on the other hand, focuses on self-reflection and improving performance through introspection of past attempts. The key difference is that ReAct happens in real-time during task execution, while Reflexion involves learning from past experiences to improve future attempts.",
        timestamp: new Date(Date.now() - 79200000), // 22 hours ago
        isRead: true,
      },
      {
        id: 4,
        senderId: 999,
        senderName: "You",
        messageType: "text",
        content: "That makes sense. Do you have any code examples that show these patterns in action?",
        timestamp: new Date(Date.now() - 75600000), // 21 hours ago
        isRead: true,
      },
      {
        id: 5,
        senderId: 101,
        senderName: "Dr. Alan Chen",
        senderAvatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        messageType: "file",
        content: "Here's a code example of the ReAct pattern implementation:",
        fileUrl: "react_pattern_example.py",
        fileType: "python",
        fileName: "react_pattern_example.py",
        timestamp: new Date(Date.now() - 72000000), // 20 hours ago
        isRead: true,
      },
      {
        id: 6,
        senderId: 101,
        senderName: "Dr. Alan Chen",
        senderAvatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        messageType: "text",
        content: "And here's an explanation of how the pattern works in this code. Notice how it interleaves reasoning and action steps...",
        timestamp: new Date(Date.now() - 71900000), // 19 hours 58 minutes ago
        isRead: true,
      },
      {
        id: 7,
        senderId: 999,
        senderName: "You",
        messageType: "text",
        content: "Thanks! I'll study this example. One more question - when would you recommend using ReAct vs. Reflexion in a real-world application?",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true,
      },
      {
        id: 8,
        senderId: 101,
        senderName: "Dr. Alan Chen",
        senderAvatar: "https://placehold.co/200/5046e5/ffffff?text=AC",
        messageType: "audio",
        content: "Voice message",
        audioUrl: "voice_message.mp3",
        audioDuration: 42, // seconds
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isRead: false,
      },
    ],
  },
  {
    id: 2,
    courseId: "2",
    instructorId: 103,
    messages: [
      {
        id: 20,
        senderId: 103,
        senderName: "Prof. James Wilson",
        senderAvatar: "https://placehold.co/200/46e58e/ffffff?text=JW",
        messageType: "text",
        content: "Welcome to the MLOps Engineering course helpdesk. What questions do you have about the course material?",
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        isRead: true,
      },
      {
        id: 21,
        senderId: 999,
        senderName: "You",
        messageType: "text",
        content: "Hi Professor Wilson, I'm trying to set up the CI/CD pipeline for the project but I'm running into issues with the deployment steps. Could you take a look at my configuration?",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        isRead: true,
      },
      {
        id: 22,
        senderId: 999,
        senderName: "You",
        messageType: "file",
        content: "Here's my configuration file:",
        fileUrl: "pipeline_config.yaml",
        fileType: "yaml",
        fileName: "pipeline_config.yaml",
        timestamp: new Date(Date.now() - 172700000), // 2 days ago, 1 minute later
        isRead: true,
      },
    ],
  },
];

// Helper function to format timestamps
const formatMessageTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If less than 24 hours, show time
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this year, show month and day
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Otherwise show full date
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to format audio duration
const formatAudioDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface MessageProps {
  message: any;
  isCurrentUser: boolean;
}

// Message component
const Message = ({ message, isCurrentUser }: MessageProps) => {
  const { theme } = useTheme();
  const isAudio = message.messageType === 'audio';
  const isFile = message.messageType === 'file';
  const isText = message.messageType === 'text';
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'python':
      case 'yaml':
      case 'json':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isCurrentUser ? "flex-row-reverse" : ""
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          {message.senderAvatar ? (
            <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          ) : (
            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[75%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
          <span>{isCurrentUser ? "You" : message.senderName}</span>
          <span>•</span>
          <span>{formatMessageTime(new Date(message.timestamp))}</span>
          {isCurrentUser && message.isRead && (
            <CheckCheck className="h-3 w-3 text-blue-500" />
          )}
        </div>
        
        {isText && (
          <div className={cn(
            "px-4 py-2.5 rounded-2xl",
            isCurrentUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : theme === "dark"
                ? "bg-gray-800 text-gray-100 rounded-tl-none"
                : "bg-gray-100 text-gray-900 rounded-tl-none"
          )}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        
        {isFile && (
          <div className={cn(
            "px-4 py-3 rounded-2xl min-w-[200px]",
            isCurrentUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : theme === "dark"
                ? "bg-gray-800 text-gray-100 rounded-tl-none"
                : "bg-gray-100 text-gray-900 rounded-tl-none"
          )}>
            <div className="mb-2">{message.content}</div>
            <div className="flex items-center gap-2 p-2 rounded bg-opacity-10 bg-gray-500">
              {getFileIcon(message.fileType)}
              <div className="flex-grow overflow-hidden">
                <div className="truncate text-sm">{message.fileName}</div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <span className="sr-only">Download</span>
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {isAudio && (
          <div className={cn(
            "px-4 py-3 rounded-2xl",
            isCurrentUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : theme === "dark"
                ? "bg-gray-800 text-gray-100 rounded-tl-none"
                : "bg-gray-100 text-gray-900 rounded-tl-none"
          )}>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-opacity-20 bg-white">
                <Play className="h-4 w-4" />
              </Button>
              <div className="w-32 h-2 bg-gray-400 bg-opacity-30 rounded-full">
                <div className="h-full w-1/4 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-xs">{formatAudioDuration(message.audioDuration)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AudioRecorder component
const AudioRecorder = ({ onClose, onSend }: { onClose: () => void, onSend: () => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setDuration(0);
    timerRef.current = window.setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };
  
  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };
  
  const handleSend = () => {
    handleStopRecording();
    onSend();
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
      <div className="flex-grow">
        <div className="flex items-center gap-3">
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Recording... {formatAudioDuration(duration)}</span>
            </span>
          ) : (
            <span>Ready to record</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isRecording ? (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-9 w-9 rounded-full p-0 text-red-500"
            onClick={handleStopRecording}
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-9 w-9 rounded-full p-0"
            onClick={handleStartRecording}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
        <Button 
          size="sm" 
          disabled={!isRecording && duration === 0}
          onClick={handleSend}
        >
          Send
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// File Upload component
const FileUpload = ({ onClose, onSend, files }: { onClose: () => void, onSend: () => void, files: File[] }) => {
  return (
    <div className="p-3 border rounded-md bg-background">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Upload Files</h4>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {files.map((file, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border rounded mb-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <div className="flex-grow">
            <div className="text-sm truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-3">
        <Button size="sm" onClick={onSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

// Chat page component
export default function HelpdeskPage() {
  const [activeTab, setActiveTab] = useState<string>("1");
  const [activeInstructor, setActiveInstructor] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState(mockCourses);
  const [conversations, setConversations] = useState(mockConversations);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  
  // Filtered conversations based on active course and instructor
  const currentConversation = conversations.find(
    (conv) => conv.courseId === activeTab && conv.instructorId === activeInstructor
  );
  
  // Get current course
  const currentCourse = courses.find((course) => course.id === activeTab);
  
  // Get current instructor
  const currentInstructor = currentCourse?.instructors.find((instructor) => instructor.id === activeInstructor);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !showAudioRecorder && (!showFileUpload || uploadedFiles.length === 0)) return;
    
    const newConversations = [...conversations];
    const convIndex = newConversations.findIndex(
      (conv) => conv.courseId === activeTab && conv.instructorId === activeInstructor
    );
    
    let messageType = 'text';
    let messageContent = newMessage;
    let additionalData: Record<string, any> = {};
    
    if (showAudioRecorder) {
      messageType = 'audio';
      messageContent = 'Voice message';
      additionalData = {
        audioUrl: 'voice_message.mp3',
        audioDuration: 30, // mock duration
      };
    } else if (showFileUpload && uploadedFiles.length > 0) {
      messageType = 'file';
      messageContent = 'File attachment';
      additionalData = {
        fileUrl: uploadedFiles[0].name,
        fileType: uploadedFiles[0].name.split('.').pop() || 'file',
        fileName: uploadedFiles[0].name,
      };
    }
    
    const newMessageObj = {
      id: Date.now(),
      senderId: 999, // current user
      senderName: "You",
      messageType,
      content: messageContent,
      timestamp: new Date(),
      isRead: false,
      ...additionalData
    };
    
    if (convIndex >= 0) {
      newConversations[convIndex].messages.push(newMessageObj);
    } else {
      // Create new conversation if none exists
      newConversations.push({
        id: Date.now(),
        courseId: activeTab,
        instructorId: activeInstructor!,
        messages: [newMessageObj],
      });
    }
    
    setConversations(newConversations);
    setNewMessage("");
    setShowAudioRecorder(false);
    setShowFileUpload(false);
    setUploadedFiles([]);
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
      setShowFileUpload(true);
    }
  };
  
  // Get instructor status display properties
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online' };
      case 'away':
        return { color: 'bg-yellow-500', text: 'Away' };
      case 'offline':
        return { color: 'bg-gray-500', text: 'Offline' };
      default:
        return { color: 'bg-gray-500', text: 'Offline' };
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentConversation?.messages]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative">
      <ParticleBackground />
      
      <div className="h-screen flex flex-col relative z-10">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center px-4">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            
            <h1 className="text-xl font-bold">Solve with Prof</h1>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={cn(
            "w-80 border-r flex flex-col",
            theme === "dark" ? "bg-black/40" : "bg-white/80",
            "backdrop-blur-sm"
          )}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="1" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium">My Courses</h3>
                </div>
                <TabsList className="grid p-0 h-auto">
                  {courses.map((course) => (
                    <TabsTrigger
                      key={course.id}
                      value={course.id}
                      className="justify-start px-4 py-2 rounded-none border-b-0 data-[state=active]:bg-accent"
                    >
                      {course.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {courses.map((course) => (
                <TabsContent key={course.id} value={course.id} className="flex-1 flex flex-col mt-0 pt-0">
                  <div className="border-b px-4 py-2">
                    <h3 className="text-sm font-medium">Course Instructors</h3>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <div className="px-2 py-4">
                      {course.instructors.map((instructor) => (
                        <button
                          key={instructor.id}
                          className={cn(
                            "w-full flex items-center gap-3 px-2 py-3 rounded-md text-left mb-1",
                            activeInstructor === instructor.id
                              ? "bg-accent"
                              : "hover:bg-muted"
                          )}
                          onClick={() => setActiveInstructor(instructor.id)}
                        >
                          <div className="relative">
                            <Avatar>
                              {instructor.avatar ? (
                                <AvatarImage src={instructor.avatar} alt={instructor.name} />
                              ) : (
                                <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className={cn(
                              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                              getStatusDisplay(instructor.status).color
                            )} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{instructor.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                getStatusDisplay(instructor.status).color
                              )} />
                              <span>{getStatusDisplay(instructor.status).text}</span>
                            </div>
                          </div>
                          
                          {/* Unread indicator */}
                          {currentConversation && currentConversation.instructorId === instructor.id && 
                           currentConversation.messages.some(m => !m.isRead && m.senderId !== 999) && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {activeInstructor ? (
              <>
                {/* Chat header */}
                <div className={cn(
                  "flex items-center justify-between p-4 border-b",
                  theme === "dark" ? "bg-gray-900/50" : "bg-white/50",
                  "backdrop-blur-sm"
                )}>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {currentInstructor?.avatar ? (
                        <AvatarImage src={currentInstructor.avatar} alt={currentInstructor.name} />
                      ) : (
                        <AvatarFallback>{currentInstructor?.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{currentInstructor?.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          getStatusDisplay(currentInstructor?.status || 'offline').color
                        )} />
                        <span>{getStatusDisplay(currentInstructor?.status || 'offline').text}</span>
                      </div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View instructor profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="max-w-3xl mx-auto">
                    {currentConversation?.messages.length ? (
                      <>
                        {/* Conversation date */}
                        <div className="flex justify-center mb-6">
                          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                            {new Date(currentConversation.messages[0].timestamp).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                          </Badge>
                        </div>
                        
                        {currentConversation.messages.map((message) => (
                          <Message
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === 999}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                          <p className="text-muted-foreground mb-4 max-w-md">
                            Send a message to {currentInstructor?.name} about your questions regarding the course content.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Audio recorder */}
                {showAudioRecorder && (
                  <div className="px-4 py-3 bg-background border-t">
                    <AudioRecorder
                      onClose={() => setShowAudioRecorder(false)}
                      onSend={handleSendMessage}
                    />
                  </div>
                )}
                
                {/* File upload */}
                {showFileUpload && (
                  <div className="px-4 py-3 bg-background border-t">
                    <FileUpload
                      files={uploadedFiles}
                      onClose={() => setShowFileUpload(false)}
                      onSend={handleSendMessage}
                    />
                  </div>
                )}
                
                {/* Message input */}
                {!showAudioRecorder && !showFileUpload && (
                  <div className={cn(
                    "p-4 border-t flex items-end gap-2",
                    theme === "dark" ? "bg-gray-900/50" : "bg-white/50",
                    "backdrop-blur-sm"
                  )}>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setShowAudioRecorder(true)}
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 flex items-end">
                      <Input
                        className="min-h-10 py-6 resize-none"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      disabled={!newMessage.trim()}
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Solve with Prof</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Select a course and instructor from the sidebar to start a conversation about your course-related questions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}