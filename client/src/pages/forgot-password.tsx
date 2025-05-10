import { useState } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/schema";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      form.reset();
    }, 1500);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-3xl overflow-hidden transition-all duration-500 p-8 sm:p-10">
        {!isSuccess ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">Reset Your Password</h1>
            <p className="text-center text-muted-foreground mb-8">Enter your email to receive reset instructions.</p>
          
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                
                <Button type="submit" className="w-full primary-btn py-6" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </Button>
                
                <div className="text-center mt-6">
                  <Link href="/login" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Return to Login
                  </Link>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="text-green-500 h-8 w-8" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Reset Link Sent Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              We've sent instructions to reset your password. Please check your email inbox.
            </p>
            <Link href="/login" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
