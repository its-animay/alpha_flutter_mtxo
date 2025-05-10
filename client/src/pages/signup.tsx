import { useState } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User, Check } from "lucide-react";
import { signupSchema } from "@/lib/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "learner",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      form.reset();
      // In a real app, you'd handle signup success/error here
    }, 1500);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl overflow-hidden transition-all duration-500 p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">Join MTXO EdTech — It's Free</h1>
        <p className="text-center text-muted-foreground mb-8">Master GenAI, Python, and MLOps with the best tools.</p>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="John Doe" 
                        className="pl-10 pr-4 py-6 rounded-xl input-glow bg-input/70 border" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="your.email@example.com" 
                        className="pl-10 pr-4 py-6 rounded-xl input-glow bg-input/70 border" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 pr-4 py-6 rounded-xl input-glow bg-input/70 border" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 pr-4 py-6 rounded-xl input-glow bg-input/70 border" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Select Your Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="learner"
                          id="role-learner"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="role-learner"
                          className={`cursor-pointer flex flex-col items-center justify-center p-4 bg-input/70 rounded-xl border transition-all text-center hover:border-primary
                                     ${field.value === "learner" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <User className="h-5 w-5 mb-1" />
                          <span className="text-sm font-medium">Learner</span>
                        </Label>
                      </div>
                      
                      <div className="relative">
                        <RadioGroupItem
                          value="researcher"
                          id="role-researcher"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="role-researcher"
                          className={`cursor-pointer flex flex-col items-center justify-center p-4 bg-input/70 rounded-xl border transition-all text-center hover:border-primary
                                     ${field.value === "researcher" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 17.5V18.5C10 20.1569 11.3431 21.5 13 21.5C14.6569 21.5 16 20.1569 16 18.5V17.5M18 10.5V3.5C18 2.39543 17.1046 1.5 16 1.5H14M15 13.5H11M8 13.5C5.23858 13.5 3 11.2614 3 8.5C3 5.73858 5.23858 3.5 8 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-sm font-medium">Researcher</span>
                        </Label>
                      </div>
                      
                      <div className="relative">
                        <RadioGroupItem
                          value="educator"
                          id="role-educator"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="role-educator"
                          className={`cursor-pointer flex flex-col items-center justify-center p-4 bg-input/70 rounded-xl border transition-all text-center hover:border-primary
                                     ${field.value === "educator" ? "border-primary bg-primary/5" : ""}`}
                        >
                          <svg className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 10V8C22 6.89543 21.1046 6 20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H12M22 10L12 16M22 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-sm font-medium">Educator</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="terms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms</a> & <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full primary-btn py-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <span>Create Account</span>
              )}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
