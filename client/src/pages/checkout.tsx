import { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { getCourseById } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Will use this when we have the actual Stripe key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'dummy-key');

export default function Checkout() {
  const [match, params] = useRoute('/checkout/:courseId');
  const [_, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const courseId = params?.courseId;
  const course = courseId ? getCourseById(courseId) : undefined;
  
  const urlParams = new URLSearchParams(window.location.search);
  const planType = urlParams.get('plan') || 'one-time';
  
  // Calculate price based on the selected plan
  const price = course && (() => {
    if (planType === 'monthly') {
      return course.enrollmentOptions.subscription.monthly;
    } else if (planType === 'yearly') {
      return course.enrollmentOptions.subscription.yearly;
    } else {
      return course.enrollmentOptions.oneTime.discountedPrice || course.enrollmentOptions.oneTime.price;
    }
  })();
  
  useEffect(() => {
    if (!course) {
      navigate('/courses');
      return;
    }
    
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      setLoading(false);
      setError('Stripe key is not configured. Please contact support.');
      return;
    }
    
    // Uncomment when we have the backend API
    /*
    const fetchPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          courseId: course.id,
          amount: price * 100, // Convert to cents
          planType
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again later.');
        toast({
          title: 'Payment Error',
          description: 'Failed to initialize payment. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentIntent();
    */
    
    // For now, let's simulate a delay and use a dummy client secret
    const timer = setTimeout(() => {
      // In a real implementation, this would be the actual client secret from Stripe
      setClientSecret('dummy_client_secret_' + Date.now());
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [course, price, planType, navigate, toast]);
  
  if (!course) return null;
  
  // Use a placeholder image until real images are available
  const thumbnailSrc = course.thumbnail.startsWith('/') 
    ? `https://placehold.co/600x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
    : course.thumbnail;
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost"
          size="sm"
          className="mr-2"
          asChild
        >
          <Link href={`/courses/${course.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Initializing payment...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-destructive mb-4 text-center">
                {error}
              </div>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#00C8FF',
                  }
                }
              }}
            >
              <CheckoutForm courseId={course.id} planType={planType as 'one-time' | 'monthly' | 'yearly'} />
            </Elements>
          ) : null}
        </div>
        
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden">
                  <img 
                    src={thumbnailSrc}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.totalDuration}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm mb-2">Plan:</div>
                <div className="font-medium">
                  {planType === 'one-time' 
                    ? 'One-time Purchase (Lifetime Access)' 
                    : planType === 'monthly' 
                      ? 'Monthly Subscription' 
                      : 'Annual Subscription'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <div>Subtotal</div>
                  <div>${price}.00</div>
                </div>
                
                {planType === 'one-time' && course.enrollmentOptions.oneTime.discountedPrice && (
                  <div className="flex justify-between text-green-500">
                    <div>Discount</div>
                    <div>-${course.enrollmentOptions.oneTime.price - course.enrollmentOptions.oneTime.discountedPrice}.00</div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <div>Tax</div>
                  <div>$0.00</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <div>Total</div>
                <div>${price}.00</div>
              </div>
              
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout with Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface CheckoutFormProps {
  courseId: string;
  planType: 'one-time' | 'monthly' | 'yearly';
}

function CheckoutForm({ courseId, planType }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [_, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, we would confirm the payment with Stripe
      /*
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + `/course/${courseId}/success?plan=${planType}`,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      */
      
      // For now, let's simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      navigate(`/course/${courseId}/success?plan=${planType}`);
      
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      toast({
        title: 'Payment Failed',
        description: err.message || 'Payment failed. Please try again.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Billing Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" required />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            {/* This is where the Stripe Elements will be rendered */}
            {import.meta.env.VITE_STRIPE_PUBLIC_KEY ? (
              <PaymentElement />
            ) : (
              <div className="border rounded-md p-4 text-muted-foreground">
                Stripe Payment Element would appear here when API keys are configured.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full primary-btn py-6"
          disabled={!stripe || isProcessing || !import.meta.env.VITE_STRIPE_PUBLIC_KEY}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${planType === 'one-time' ? 'once' : planType === 'monthly' ? 'monthly' : 'yearly'}`
          )}
        </Button>
        
        {!import.meta.env.VITE_STRIPE_PUBLIC_KEY && (
          <div className="mt-2 text-sm text-center text-muted-foreground">
            Note: Payment is disabled because Stripe API keys are not configured.
          </div>
        )}
      </div>
    </form>
  );
}