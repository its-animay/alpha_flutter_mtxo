import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import { ThemeToggle } from "@/components/theme-toggle";
import { ParticleBackground } from "@/components/particle-background";
import { FactCard } from "@/components/fact-card";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
