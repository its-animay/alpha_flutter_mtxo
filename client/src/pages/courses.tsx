import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  courses, 
  filterCoursesBySkillLevel, 
  filterCoursesByTags, 
  filterCoursesByPriceType, 
  filterCoursesByDuration,
  searchCourses,
  type Course,
  type CourseSkillLevel,
  type CourseTag,
  type CoursePrice,
  type CourseDuration
} from "@/data/courses";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Search, Filter, Clock, Tag, ChevronRight } from "lucide-react";

export default function CourseCatalog() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [skillLevelFilter, setSkillLevelFilter] = useState<CourseSkillLevel | "All">("All");
  const [tagsFilter, setTagsFilter] = useState<CourseTag[]>([]);
  const [priceFilter, setPriceFilter] = useState<CoursePrice | "All">("All");
  const [durationFilter, setDurationFilter] = useState<CourseDuration | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Apply filters when any filter or search query changes
  useEffect(() => {
    let result = courses;
    
    // Apply skill level filter
    result = filterCoursesBySkillLevel(result, skillLevelFilter);
    
    // Apply tags filter
    result = filterCoursesByTags(result, tagsFilter);
    
    // Apply price filter
    result = filterCoursesByPriceType(result, priceFilter);
    
    // Apply duration filter
    result = filterCoursesByDuration(result, durationFilter);
    
    // Apply search
    result = searchCourses(result, searchQuery);
    
    setFilteredCourses(result);
  }, [skillLevelFilter, tagsFilter, priceFilter, durationFilter, searchQuery]);
  
  // Reset all filters
  const resetFilters = () => {
    setSkillLevelFilter("All");
    setTagsFilter([]);
    setPriceFilter("All");
    setDurationFilter("All");
    setSearchQuery("");
  };
  
  // Toggle tag in filter
  const toggleTagFilter = (tag: CourseTag) => {
    if (tagsFilter.includes(tag)) {
      setTagsFilter(tagsFilter.filter(t => t !== tag));
    } else {
      setTagsFilter([...tagsFilter, tag]);
    }
  };
  
  const allTags: CourseTag[] = ["GenAI", "Python", "MLOps", "RealWorld", "Agents", "LLMs", "Computer Vision", "NLP"];
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-muted-foreground">
          Discover our cutting-edge courses in AI, Machine Learning, and more
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses, topics, or instructors"
              className="pl-10 pr-4 py-6 rounded-xl input-glow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 py-6 px-4">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={tagsFilter.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Skill Level</h4>
                  <Select
                    value={skillLevelFilter}
                    onValueChange={(value) => setSkillLevelFilter(value as CourseSkillLevel | "All")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </h4>
                  <Select
                    value={durationFilter}
                    onValueChange={(value) => setDurationFilter(value as CourseDuration | "All")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Any Duration</SelectItem>
                      <SelectItem value="Short">Short</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Price</h4>
                  <Select
                    value={priceFilter}
                    onValueChange={(value) => setPriceFilter(value as CoursePrice | "All")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Prices</SelectItem>
                      <SelectItem value="Free">Free Only</SelectItem>
                      <SelectItem value="Paid">Paid Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Active Filters */}
        {(tagsFilter.length > 0 || 
          skillLevelFilter !== "All" || 
          priceFilter !== "All" || 
          durationFilter !== "All") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {skillLevelFilter !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {skillLevelFilter}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setSkillLevelFilter("All")}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {priceFilter !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {priceFilter}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setPriceFilter("All")}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {durationFilter !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {durationFilter}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => setDurationFilter("All")}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {tagsFilter.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button 
                  className="ml-1 hover:text-destructive" 
                  onClick={() => toggleTagFilter(tag)}
                >
                  ×
                </button>
              </Badge>
            ))}
            
            <Button 
              variant="ghost" 
              className="h-7 px-2 text-xs" 
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </p>
        
        <Select defaultValue="popular">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  // Use a placeholder image until real images are available
  const thumbnailSrc = course.thumbnail.startsWith('/') 
    ? `https://placehold.co/600x400/1a202c/e2e8f0?text=${encodeURIComponent(course.title)}`
    : course.thumbnail;
  
  // Use a placeholder for instructor avatar
  const instructorAvatarSrc = course.instructor.avatar.startsWith('/')
    ? `https://placehold.co/100x100/1a202c/e2e8f0?text=${encodeURIComponent(course.instructor.name.charAt(0))}`
    : course.instructor.avatar;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg glass-card hover:border-primary/50 transform-gpu hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img 
            src={thumbnailSrc} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="absolute top-3 right-3 z-10">
          {course.priceType === "Free" ? (
            <Badge className="bg-green-500 hover:bg-green-600 shadow-lg">Free</Badge>
          ) : (
            course.enrollmentOptions.freeTrial && (
              <Badge className="bg-primary hover:bg-primary/80 shadow-lg">Free Trial</Badge>
            )
          )}
        </div>
        <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-white/10 text-white">
            {course.skillLevel}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {course.tags.slice(0, 2).map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            >
              {tag}
            </Badge>
          ))}
          {course.tags.length > 2 && (
            <Badge variant="outline" className="text-xs bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20">
              +{course.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {course.subtitle}
        </p>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-muted/30 border border-muted/50">
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20">
            <img 
              src={instructorAvatarSrc} 
              alt={course.instructor.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="text-sm font-medium">{course.instructor.name}</p>
            <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex bg-muted/30 p-1 rounded-md">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  fill={i < Math.floor(course.rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="text-sm font-medium ml-1">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({course.reviewCount})</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/30 p-1 rounded-md">
            <Clock className="h-4 w-4" />
            <span>{course.totalDuration}</span>
          </div>
        </div>
      </CardContent>
      
      <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <CardFooter className="p-4 flex justify-between items-center">
        <div>
          {course.priceType === "Free" ? (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-green-500">Free</span>
              <span className="text-xs text-muted-foreground">Lifetime Access</span>
            </div>
          ) : (
            <div>
              {course.enrollmentOptions.oneTime.discountedPrice ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">${course.enrollmentOptions.oneTime.discountedPrice}</span>
                    <span className="text-muted-foreground line-through text-sm">${course.enrollmentOptions.oneTime.price}</span>
                  </div>
                  <span className="text-xs text-green-500">
                    Save ${(course.enrollmentOptions.oneTime.price - course.enrollmentOptions.oneTime.discountedPrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-primary">${course.enrollmentOptions.oneTime.price}</span>
                  <span className="text-xs text-muted-foreground">One-time payment</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Link href={`/courses/${course.id}`}>
          <Button className="primary-btn group relative overflow-hidden">
            <span className="z-10 relative">Preview Course</span>
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}