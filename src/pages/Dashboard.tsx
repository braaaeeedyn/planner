import { useState } from 'react';
import { AssignmentTable } from '@/components/AssignmentTable';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Filter, Search, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Dashboard() {
  const { assignments, updateAssignment, deleteAssignment } = useAssignments();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique classes for filter
  const uniqueClasses = Array.from(new Set(assignments.map(a => a.className)));

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || assignment.className === classFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && assignment.completed) ||
                         (statusFilter === 'pending' && !assignment.completed);
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const pendingAssignments = totalAssignments - completedAssignments;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              📚 Homework Tracker
            </h1>
            <p className="text-muted-foreground">
              Stay organized and never miss an assignment
            </p>
          </div>
          <ThemeSelector />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elegant p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{completedAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Filter className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{pendingAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-elegant p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(className => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          {(searchTerm || classFilter !== 'all' || statusFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {classFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Class: {classFilter}
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setClassFilter('all');
                  setStatusFilter('all');
                }}
                className="text-xs h-6"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Assignment Table */}
        <AssignmentTable
          assignments={filteredAssignments}
          onUpdateAssignment={updateAssignment}
          onDeleteAssignment={deleteAssignment}
        />
      </div>
    </div>
  );
}