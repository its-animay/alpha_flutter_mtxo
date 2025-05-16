import { useState } from "react";
import { Link } from "wouter";
import { ParticleBackground } from "@/components/particle-background";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  CreditCard,
  BookOpen,
  Award,
  Calendar,
  Check,
  Edit,
  Download,
  Camera,
  Bell,
  ChevronLeft,
} from "lucide-react";

// Mock data for UI development
const mockUser = {
  id: 1,
  fullName: "Sarah Johnson",
  username: "sarah.j",
  email: "sarah.johnson@example.com",
  phoneNumber: "+1 (555) 123-4567",
  profilePicture: "",
  role: "student",
  dateJoined: "2024-01-15",
  preferences: {
    theme: "system",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};

const mockSubscription = {
  id: 1,
  plan: "premium",
  startDate: "2024-01-15",
  endDate: "2025-01-15",
  isActive: true,
};

const mockPaymentHistory = [
  {
    id: 1,
    amount: 19900, // in cents
    date: "2024-01-15",
    method: "credit_card",
    status: "succeeded",
  },
  {
    id: 2,
    amount: 19900, // in cents
    date: "2023-12-15",
    method: "credit_card",
    status: "succeeded",
  },
  {
    id: 3,
    amount: 19900, // in cents
    date: "2023-11-15",
    method: "credit_card",
    status: "succeeded",
  },
];

const mockEnrollments = [
  {
    id: 1,
    courseId: "1",
    courseTitle: "Agentic LLMs Bootcamp",
    progress: 65,
    isCompleted: false,
    certificateId: null,
    thumbnailUrl: "https://placehold.co/600x400/1a202c/e2e8f0?text=Agent%20LLMs",
  },
  {
    id: 2,
    courseId: "2",
    courseTitle: "MLOps Engineering Professional",
    progress: 100,
    isCompleted: true,
    certificateId: "cert-123",
    thumbnailUrl: "https://placehold.co/600x400/1a202c/e2e8f0?text=MLOps",
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [subscription, setSubscription] = useState(mockSubscription);
  const [paymentHistory, setPaymentHistory] = useState(mockPaymentHistory);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
  };

  const handleNotificationChange = (type: "email" | "sms" | "push", value: boolean) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        notifications: {
          ...user.preferences.notifications,
          [type]: value,
        },
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPlanDisplay = (plan: string) => {
    switch (plan) {
      case "free":
        return { label: "Free", color: "bg-gray-500" };
      case "premium":
        return { label: "Premium", color: "bg-yellow-500" };
      case "pro":
        return { label: "Pro", color: "bg-purple-600" };
      default:
        return { label: plan, color: "bg-blue-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative pb-16">
      <ParticleBackground />
      
      <div className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <ThemeToggle />
        </div>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </header>
        
        <Tabs defaultValue="basic-info" className="space-y-6">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:inline-flex">
            <TabsTrigger value="basic-info" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic-info">
            <Card className="glass-card">
              <CardHeader className="flex sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your personal information and account details
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">
                      {user.profilePicture ? (
                        <AvatarImage src={user.profilePicture} alt={user.fullName} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {user.fullName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </Button>
                    <div className="mt-3 text-center">
                      <Badge className="mb-2 capitalize">
                        {user.role}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Joined {formatDate(user.dateJoined)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button onClick={handleSaveProfile} className="mt-4">
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Full Name</div>
                            <div>{user.fullName}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Username</div>
                            <div>{user.username}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                            <div>{user.email}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Phone Number</div>
                            <div>{user.phoneNumber || "-"}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Your current subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getPlanDisplay(subscription.plan).color} text-white`}>
                          {getPlanDisplay(subscription.plan).label} Plan
                        </Badge>
                        {subscription.isActive && <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Valid until {formatDate(subscription.endDate)}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Plan Benefits:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Access to all premium courses</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Instructor Q&A sessions</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Downloadable resources</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Completion certificates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="w-full">
                    <Button className="w-full sm:w-auto">Upgrade Plan</Button>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <p>Need help with your subscription?</p>
                    <Button variant="link" className="h-auto p-0">Contact Support</Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Recent payment transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="grid grid-cols-3 p-3 text-sm font-medium">
                          <div>Date</div>
                          <div>Amount</div>
                          <div>Status</div>
                        </div>
                        <Separator />
                        {paymentHistory.map((payment) => (
                          <div key={payment.id} className="grid grid-cols-3 p-3 text-sm">
                            <div>{formatDate(payment.date)}</div>
                            <div>{formatCurrency(payment.amount)}</div>
                            <div>
                              {payment.status === "succeeded" ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Paid
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                  Failed
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No payment history available
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Receipts
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Enrolled Courses</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/courses">Browse More Courses</Link>
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="glass-card overflow-hidden">
                    <div className="aspect-video">
                      <img
                        src={enrollment.thumbnailUrl}
                        alt={enrollment.courseTitle}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="truncate">{enrollment.courseTitle}</CardTitle>
                      <div className="flex items-center justify-between">
                        <CardDescription>
                          {enrollment.isCompleted ? 'Completed' : `${enrollment.progress}% Complete`}
                        </CardDescription>
                        {enrollment.isCompleted && (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={enrollment.progress} className="h-2" />
                      
                      <div className="mt-4 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/courses/${enrollment.courseId}`}>
                            Course Details
                          </Link>
                        </Button>
                        
                        {enrollment.isCompleted ? (
                          <Button size="sm" className="gap-2">
                            <Award className="h-4 w-4" />
                            View Certificate
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link href={`/lesson/${enrollment.courseId}/m1/l1`}>
                              Continue Learning
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {enrollments.length === 0 && (
                <Card className="p-8 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't enrolled in any courses yet
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the app looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme Mode</Label>
                      <div className="flex gap-4">
                        <Button
                          variant={user.preferences.theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: "light" } })}
                        >
                          Light
                        </Button>
                        <Button
                          variant={user.preferences.theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: "dark" } })}
                        >
                          Dark
                        </Button>
                        <Button
                          variant={user.preferences.theme === "system" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUser({ ...user, preferences: { ...user.preferences, theme: "system" } })}
                        >
                          System
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive course updates and announcements via email
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={user.preferences.notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive text message notifications for important updates
                        </div>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={user.preferences.notifications.sms}
                        onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive browser notifications for activities
                        </div>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={user.preferences.notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}