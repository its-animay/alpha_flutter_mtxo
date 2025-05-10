import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { getCourseById } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Calendar } from "lucide-react";
import confetti from "canvas-confetti";

export default function CourseSuccess() {
  const [match] = useRoute("/course-success");
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseId');
  const planType = params.get('plan') || 'one-time';
  const course = courseId ? getCourseById(courseId) : undefined;
  
  const [isConfettiShown, setIsConfettiShown] = useState(false);
  
  // Launch confetti animation
  useEffect(() => {
    if (isConfettiShown) return;
    
    try {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      
      const colors = ['#00C8FF', '#7B42F6', '#FF4A8D'];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      
      setIsConfettiShown(true);
    } catch (error) {
      console.error('Confetti error:', error);
      // Failsafe in case confetti doesn't work
      setIsConfettiShown(true);
    }
  }, [isConfettiShown]);

  if (!course) {
    return null;
  }
  
  // Use a placeholder image until real images are available
  const thumbnailSrc = course.thumbnail.startsWith('/') 
    ? `https://placehold.co/600x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
    : course.thumbnail;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500 h-10 w-10" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            {planType === 'one-time' 
              ? 'You now have lifetime access to this course.' 
              : 'Your subscription has been activated successfully.'}
          </p>
        </div>
        
        <div className="mb-10 max-w-lg mx-auto">
          <div className="flex items-center gap-4 border rounded-xl p-4 bg-card/50">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={thumbnailSrc}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {planType === 'one-time' 
                  ? 'Lifetime Access' 
                  : planType === 'monthly' 
                    ? 'Monthly Subscription' 
                    : 'Annual Subscription'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-w-md mx-auto mb-10">
          <h3 className="text-xl font-semibold">What's Next?</h3>
          
          <div className="text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Start your learning journey</p>
                <p className="text-sm text-muted-foreground">
                  Begin with the first module and progress at your own pace.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Join the community</p>
                <p className="text-sm text-muted-foreground">
                  Connect with other students in the discussion forums.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Complete your first project</p>
                <p className="text-sm text-muted-foreground">
                  Apply what you've learned with hands-on exercises.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild className="py-6">
            <Link href={`/lesson/${courseId}/m1/l1`}>
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="py-6">
            <Link href="/dashboard">
              <Calendar className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}