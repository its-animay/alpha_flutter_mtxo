import { Route, Switch, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import CourseCatalog from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Checkout from "@/pages/checkout";
import CourseSuccess from "@/pages/course-success";
import Lesson from "@/pages/lesson";
import ModuleQuiz from "@/pages/module-quiz";
import Dashboard from "@/pages/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticleBackground } from "@/components/particle-background";
import { FactCard } from "@/components/fact-card";

function Router() {
  return (
    <Switch>
      {/* Authentication Routes */}
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Course Module System Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses" component={CourseCatalog} />
      <Route path="/courses/:courseId" component={CourseDetail} />
      <Route path="/checkout/:courseId" component={Checkout} />
      <Route path="/course/:courseId/success" component={CourseSuccess} />
      <Route path="/course-success" component={CourseSuccess} />
      <Route path="/lesson/:courseId/:moduleId/:lessonId" component={Lesson} />
      <Route path="/quiz/:courseId/:moduleId" component={ModuleQuiz} />
      
      {/* Fallback Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  // Check auth routes individually since useRoute doesn't accept arrays
  const [isLoginPage] = useRoute("/login");
  const [isRootPage] = useRoute("/");
  const [isSignupPage] = useRoute("/signup");
  const [isForgotPasswordPage] = useRoute("/forgot-password");
  const isAuthPage = isLoginPage || isRootPage || isSignupPage || isForgotPasswordPage;
  
  const [isCourseLesson] = useRoute("/lesson/:courseId/:moduleId/:lessonId");
  const [isModuleQuiz] = useRoute("/quiz/:courseId/:moduleId");
  
  // Render a minimal layout for lesson pages and quizzes (no decorative elements, full-screen)
  if (isCourseLesson || isModuleQuiz) {
    return (
      <main className="min-h-screen">
        <Router />
      </main>
    );
  }
  
  // Standard layout for auth pages
  if (isAuthPage) {
    return (
      <div className="relative min-h-screen w-full flex flex-col">
        <ParticleBackground />
        
        <header className="sticky top-0 z-50 px-6 py-3 flex justify-end">
          <ThemeToggle />
        </header>
        
        <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-16">
          <Router />
        </main>
        
        <FactCard />
      </div>
    );
  }
  
  // Layout for course pages
  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <ParticleBackground />
      
      <header className="sticky top-0 z-50 px-6 py-3 flex justify-between bg-background/80 backdrop-blur-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">MTXO Labs</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-grow">
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
