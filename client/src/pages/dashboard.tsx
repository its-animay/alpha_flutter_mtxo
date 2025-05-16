import { useState } from "react";
import { Link } from "wouter";
import { courses } from "@/data/courses";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Play, 
  Award, 
  Calendar, 
  CheckCircle, 
  ExternalLink,
  BarChart, 
  Zap,
  User,
  MessageSquare
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my-courses");
  
  // Simulate enrolled courses - in a real app, this would come from the user's data
  const enrolledCourses = courses.slice(0, 2);
  
  // Simulated progress data - in a real app, this would come from the user's data
  const progressData = [
    { courseId: enrolledCourses[0].id, progress: 35, lastLesson: { moduleId: "m1", lessonId: "l3" } },
    { courseId: enrolledCourses[1].id, progress: 12, lastLesson: { moduleId: "m1", lessonId: "l2" } },
  ];
  
  // Simulated upcoming live sessions
  const upcomingSessions = [
    { 
      id: "s1", 
      title: "Advanced Prompt Engineering Techniques", 
      date: "2025-05-15T18:00:00Z",
      instructor: "Sophia Williams",
      duration: 60,
    },
    { 
      id: "s2", 
      title: "MLOps Pipeline Implementation Workshop", 
      date: "2025-05-18T19:00:00Z",
      instructor: "Miguel Ramirez",
      duration: 90,
    }
  ];
  
  // Simulated certificates
  const certificates = [
    {
      id: "c1",
      title: "Introduction to GenAI",
      issueDate: "2025-04-01",
      imageUrl: "https://placehold.co/600x400/1a202c/e2e8f0?text=Certificate",
    }
  ];
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and manage your learning journey</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/helpdesk">
              <MessageSquare className="mr-2 h-4 w-4" />
              Solve with Prof
            </Link>
          </Button>
          
          <Button asChild className="primary-btn">
            <Link href="/courses">
              <Zap className="mr-2 h-4 w-4" />
              Explore Courses
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <TabsList className="w-full grid grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-courses" className="space-y-6">
          <h2 className="text-2xl font-semibold">In Progress</h2>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => {
                const courseProgress = progressData.find(p => p.courseId === course.id);
                const progressPercentage = courseProgress?.progress || 0;
                
                // Use a placeholder image until real images are available
                const thumbnailSrc = course.thumbnail.startsWith('/') 
                  ? `https://placehold.co/600x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
                  : course.thumbnail;
                
                return (
                  <Card key={course.id} className="overflow-hidden glass-card">
                    <div className="relative">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={thumbnailSrc} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1 text-white">
                            <span className="text-sm">{progressPercentage}% Complete</span>
                            <span className="text-sm">{Math.round(parseInt(course.totalDuration) * progressPercentage / 100)}h / {course.totalDuration}</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <h3 className="font-bold text-lg truncate">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{course.instructor.name}</p>
                    </CardHeader>
                    
                    <CardContent className="pb-0">
                      {courseProgress && (
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-1">Last lesson</div>
                          <div className="bg-muted/50 rounded-lg p-2 text-sm">
                            {course.modules.find(m => m.id === courseProgress.lastLesson.moduleId)?.lessons.find(l => l.id === courseProgress.lastLesson.lessonId)?.title || "Unknown lesson"}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{course.totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.totalDuration}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-4 pb-4 flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/lesson/${course.id}/${courseProgress?.lastLesson.moduleId || "m1"}/${courseProgress?.lastLesson.lessonId || "l1"}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continue
                        </Link>
                      </Button>
                      
                      <Button variant="outline" asChild className="flex-1">
                        <Link href={`/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mt-8">Recommended Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.slice(2, 5).map(course => {
              // Use a placeholder image until real images are available
              const thumbnailSrc = course.thumbnail.startsWith('/') 
                ? `https://placehold.co/600x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
                : course.thumbnail;
              
              return (
                <Card key={course.id} className="overflow-hidden glass-card">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={thumbnailSrc} 
                      alt={course.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex gap-2 mb-1">
                      {course.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg truncate">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{course.instructor.name}</p>
                  </CardHeader>
                  
                  <CardFooter className="pt-0 pb-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>
                        View Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-6">
          <h2 className="text-2xl font-semibold">Upcoming Live Sessions</h2>
          
          {upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingSessions.map(session => {
                const sessionDate = new Date(session.date);
                const formattedDate = sessionDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = sessionDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });
                
                return (
                  <Card key={session.id} className="overflow-hidden glass-card border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        Live Session
                      </Badge>
                      <h3 className="text-xl font-bold">{session.title}</h3>
                      <div className="flex items-center text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formattedDate} at {formattedTime}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">Instructor</div>
                          <div className="text-sm text-muted-foreground">{session.instructor}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Duration</div>
                          <div className="text-sm text-muted-foreground">{session.duration} minutes</div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between gap-4">
                      <Button className="flex-1">Join Session</Button>
                      <Button variant="outline" className="flex-1">Add to Calendar</Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium mb-2">No upcoming sessions</h3>
              <p className="text-muted-foreground mb-4">You don't have any upcoming live sessions scheduled</p>
              <Button>Browse Live Sessions</Button>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mt-8">Learning Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Hours Learned</h3>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12.5</div>
                <p className="text-xs text-muted-foreground">+2.3 hours this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Lessons Completed</h3>
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">+3 lessons this week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Current Streak</h3>
                  <BarChart className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-6">
          <h2 className="text-2xl font-semibold">My Certificates</h2>
          
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map(certificate => (
                <Card key={certificate.id} className="overflow-hidden glass-card">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={certificate.imageUrl} 
                      alt={certificate.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mt-2">{certificate.title}</h3>
                  </CardHeader>
                  
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1 primary-btn">
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                    
                    <Button variant="outline" className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-4">Complete a course to earn your first certificate</p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mt-8">Courses in Progress</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course, index) => {
              const courseProgress = progressData.find(p => p.courseId === course.id);
              const progressPercentage = courseProgress?.progress || 0;
              
              return (
                <Card key={course.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://placehold.co/100x100/1a202c/e2e8f0?text=${encodeURIComponent(course.title.charAt(0))}`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{course.title}</h3>
                        <div className="flex justify-between items-center mt-2 mb-1 text-sm">
                          <span className="text-muted-foreground">{progressPercentage}% Complete</span>
                          <span className="text-muted-foreground">{Math.floor(progressPercentage * course.totalLessons / 100)}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                        <Link href={`/lesson/${course.id}/${courseProgress?.lastLesson.moduleId || "m1"}/${courseProgress?.lastLesson.lessonId || "l1"}`}>
                          Resume
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}