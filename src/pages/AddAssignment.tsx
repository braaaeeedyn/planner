import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AddAssignment() {
  const navigate = useNavigate();
  const { addAssignment } = useAssignments();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    className: '',
    assignmentName: '',
    description: '',
    link: '',
    points: '',
  });
  const [dueDate, setDueDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.className.trim() || !formData.assignmentName.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in class name and assignment name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addAssignment({
        className: formData.className.trim(),
        assignmentName: formData.assignmentName.trim(),
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
        description: formData.description.trim() || undefined,
        link: formData.link.trim() || undefined,
        points: formData.points ? parseInt(formData.points) : undefined,
        completed: false,
      });

      toast({
        title: "Assignment added!",
        description: "Your assignment has been successfully saved.",
        variant: "default",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              ➕ Add Assignment
            </h1>
            <p className="text-muted-foreground">
              Create a new homework assignment
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-elegant p-6 space-y-6">
            {/* Required Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="destructive" className="text-xs">Required</Badge>
                <span className="text-sm text-muted-foreground">These fields must be filled</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="className" className="text-sm font-medium">
                  Class Name *
                </Label>
                <Input
                  id="className"
                  value={formData.className}
                  onChange={(e) => handleInputChange('className', e.target.value)}
                  placeholder="e.g., Math 101, Biology, History"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignmentName" className="text-sm font-medium">
                  Assignment Name *
                </Label>
                <Input
                  id="assignmentName"
                  value={formData.assignmentName}
                  onChange={(e) => handleInputChange('assignmentName', e.target.value)}
                  placeholder="e.g., Homework 3, Chapter 5 Quiz, Final Project"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">Optional</Badge>
                <span className="text-sm text-muted-foreground">Additional details</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional notes about the assignment..."
                  className="min-h-20 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-sm font-medium">
                  Link
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://classroom.google.com/..."
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="text-sm font-medium">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', e.target.value)}
                  placeholder="100"
                  min="0"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}