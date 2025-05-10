import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { 
  getCourseById, 
  type CourseModule, 
  type CourseLessonItem 
} from "@/data/courses";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter,
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Star,
  Users,
  CheckCircle,
  PlayCircle,
  Lock,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Award
} from "lucide-react";

export default function CourseDetail() {
  const [_, params] = useRoute("/courses/:courseId");
  const [, setLocation] = useLocation();
  
  const courseId = params?.courseId;
  const course = courseId ? getCourseById(courseId) : undefined;
  
  // If course not found, redirect to courses page
  useEffect(() => {
    if (courseId && !course) {
      setLocation("/courses");
    }
  }, [courseId, course, setLocation]);
  
  if (!course) {
    return (
      <div className="container px-4 py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }
  
  // Placeholder for image
  const thumbnailSrc = course.thumbnail.startsWith('/') 
    ? `https://placehold.co/1200x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
    : course.thumbnail;
  
  // Placeholder for instructor avatar  
  const instructorAvatarSrc = course.instructor.avatar.startsWith('/')
    ? `https://placehold.co/100x100/1a202c/e2e8f0?text=${encodeURIComponent(course.instructor.name.charAt(0))}`
    : course.instructor.avatar;
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          asChild
        >
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Courses
          </Link>
        </Button>
      </div>
      
      {/* Course Header */}
      <div className="mb-8">
        <div className="relative w-full rounded-xl overflow-hidden mb-6">
          <div className="aspect-[3/1] w-full">
            <img 
              src={thumbnailSrc}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 p-4 md:p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {course.tags.map(tag => (
                <Badge key={tag} className="bg-primary/70 hover:bg-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-1">{course.title}</h1>
            <p className="text-base md:text-lg text-white/90">{course.subtitle}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <span className="font-medium">{course.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({course.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.studentsEnrolled.toLocaleString()} students</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.totalDuration}</span>
              </div>
              
              <Badge variant="outline">
                {course.skillLevel}
              </Badge>
            </div>
            
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="py-4">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <h3 className="flex items-center mb-4 text-xl font-bold">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Course Description
                  </h3>
                  <p>{course.description}</p>
                  
                  <h3 className="flex items-center mt-8 mb-4 text-xl font-bold">
                    <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                    What You'll Learn
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYoullLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="flex items-center mt-8 mb-4 text-xl font-bold">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {course.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-medium shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum" className="py-4">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">Course Content</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                    <div>{course.modules.length} modules</div>
                    <div>{course.totalLessons} lessons</div>
                    <div>{course.totalDuration} total length</div>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <div className="font-medium flex items-center gap-2">
                            {module.title}
                            {module.isFree && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Free Access
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {module.lessons.length} lessons • {Math.floor(parseInt(module.duration) / 60)}h {parseInt(module.duration) % 60}m
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <LessonItem 
                              key={lesson.id} 
                              lesson={lesson} 
                              moduleIndex={moduleIndex + 1} 
                              lessonIndex={lessonIndex + 1} 
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="instructor" className="py-4">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img 
                      src={instructorAvatarSrc} 
                      alt={course.instructor.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                    <p className="text-muted-foreground">{course.instructor.title}</p>
                  </div>
                </div>
                <p className="mb-6">{course.instructor.bio}</p>
              </TabsContent>
              
              <TabsContent value="reviews" className="py-4">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Student Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({course.reviewCount} reviews)</span>
                  </div>
                </div>
                
                {course.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                                {review.userAvatar ? (
                                  <img 
                                    src={review.userAvatar.startsWith('/') 
                                      ? `https://placehold.co/100x100/1a202c/e2e8f0?text=${encodeURIComponent(review.userName.charAt(0))}` 
                                      : review.userAvatar
                                    } 
                                    alt={review.userName} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                    {review.userName.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{review.userName}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet for this course.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">
                  {course.priceType === "Free" ? (
                    <span>Enroll for Free</span>
                  ) : (
                    <div className="flex items-end gap-2">
                      {course.enrollmentOptions.oneTime.discountedPrice ? (
                        <>
                          <span className="text-3xl">${course.enrollmentOptions.oneTime.discountedPrice}</span>
                          <span className="text-lg line-through text-muted-foreground">${course.enrollmentOptions.oneTime.price}</span>
                          <span className="text-green-500 text-sm">
                            {Math.round((1 - course.enrollmentOptions.oneTime.discountedPrice! / course.enrollmentOptions.oneTime.price) * 100)}% off
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl">${course.enrollmentOptions.oneTime.price}</span>
                      )}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 space-y-4">
                <EnrollmentOptions courseId={course.id} course={course} />
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-3 pt-2">
                <p className="text-center text-sm text-muted-foreground">
                  30-Day Money-Back Guarantee
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{course.totalDuration} on-demand video</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.totalLessons} lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonItemProps {
  lesson: CourseLessonItem;
  moduleIndex: number;
  lessonIndex: number;
}

function LessonItem({ lesson, moduleIndex, lessonIndex }: LessonItemProps) {
  return (
    <div className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-grow flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
          {moduleIndex}.{lessonIndex}
        </div>
        <div>
          <div className="font-medium flex items-center gap-2">
            {lesson.title}
            {lesson.isFree && (
              <Badge variant="outline" className="ml-2 text-xs">
                Free Preview
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            <span>{Math.floor(parseInt(lesson.duration) / 60) > 0 ? `${Math.floor(parseInt(lesson.duration) / 60)}h ` : ''}{parseInt(lesson.duration) % 60}m</span>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {lesson.isFree ? (
          <PlayCircle className="h-5 w-5 text-primary" />
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

interface EnrollmentOptionsProps {
  courseId: string;
  course: {
    priceType: "Free" | "Paid";
    enrollmentOptions: {
      freeTrial: boolean;
      oneTime: {
        price: number;
        discountedPrice?: number;
      };
      subscription: {
        monthly: number;
        yearly: number;
      };
    };
  };
}

function EnrollmentOptions({ courseId, course }: EnrollmentOptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'monthly' | 'yearly'>('one-time');
  
  return (
    <div className="space-y-4">
      {course.priceType === "Free" ? (
        <Button className="w-full primary-btn py-6">
          Enroll Now - Free Access
        </Button>
      ) : (
        <>
          {/* Plan Selection */}
          <div className="space-y-3">
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPlan === 'one-time' ? 'border-primary bg-primary/5' : 'bg-card'}`}
              onClick={() => setSelectedPlan('one-time')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">One-time purchase</h4>
                  <p className="text-xs text-muted-foreground">Full lifetime access</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    ${course.enrollmentOptions.oneTime.discountedPrice || course.enrollmentOptions.oneTime.price}
                  </div>
                  {course.enrollmentOptions.oneTime.discountedPrice && (
                    <div className="text-xs line-through text-muted-foreground">
                      ${course.enrollmentOptions.oneTime.price}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'bg-card'}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Monthly subscription</h4>
                  <p className="text-xs text-muted-foreground">Access to all courses</p>
                </div>
                <div className="font-bold">${course.enrollmentOptions.subscription.monthly}/mo</div>
              </div>
            </div>
            
            <div 
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedPlan === 'yearly' ? 'border-primary bg-primary/5' : 'bg-card'}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Annual subscription</h4>
                  <p className="text-xs text-muted-foreground">
                    Save {Math.round((1 - (course.enrollmentOptions.subscription.yearly / 12) / course.enrollmentOptions.subscription.monthly) * 100)}% off monthly
                  </p>
                </div>
                <div>
                  <div className="font-bold">${course.enrollmentOptions.subscription.yearly}/yr</div>
                  <div className="text-xs text-muted-foreground text-right">
                    ${(course.enrollmentOptions.subscription.yearly / 12).toFixed(2)}/mo
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Link href={`/checkout/${courseId}?plan=${selectedPlan}`}>
            <Button className="w-full primary-btn py-6">
              {selectedPlan === 'one-time' 
                ? 'Buy Now' 
                : selectedPlan === 'monthly' 
                  ? 'Subscribe Monthly' 
                  : 'Subscribe Yearly'}
            </Button>
          </Link>
          
          {course.enrollmentOptions.freeTrial && (
            <Link href={`/course/${courseId}/free-trial`}>
              <Button 
                variant="outline" 
                className="w-full py-6"
              >
                Start Free Trial
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}