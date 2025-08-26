import { useState } from 'react';
import { Assignment, SortConfig, SortField } from '@/types/assignment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, ChevronUp, ChevronDown, MoreHorizontal, Pencil } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AssignmentTableProps {
  assignments: Assignment[];
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
}

export function AssignmentTable({ assignments, onUpdateAssignment, onDeleteAssignment }: AssignmentTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'dueDate', direction: 'asc' });
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Assignment>>({});

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEditClick = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditFormData({
      className: assignment.className,
      assignmentName: assignment.assignmentName,
      dueDate: assignment.dueDate,
      description: assignment.description,
      points: assignment.points,
      link: assignment.link,
    });
  };

  const handleSaveEdit = () => {
    if (editingAssignment) {
      onUpdateAssignment(editingAssignment.id, editFormData);
      setEditingAssignment(null);
    }
  };

  const handleInputChange = (field: keyof Assignment, value: string | number | boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    const { field, direction } = sortConfig;
    const multiplier = direction === 'asc' ? 1 : -1;

    switch (field) {
      case 'dueDate': {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return (dateA - dateB) * multiplier;
      }
      case 'className':
        return a.className.localeCompare(b.className) * multiplier;
      case 'assignmentName':
        return a.assignmentName.localeCompare(b.assignmentName) * multiplier;
      case 'points': {
        const pointsA = a.points || 0;
        const pointsB = b.points || 0;
        return (pointsA - pointsB) * multiplier;
      }
      default:
        return 0;
    }
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd') : '—';
    } catch {
      return '—';
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 font-semibold text-muted-foreground hover:text-foreground"
    >
      {children}
      {sortConfig.field === field && (
        sortConfig.direction === 'asc' ? 
          <ChevronUp className="w-4 h-4 ml-1" /> : 
          <ChevronDown className="w-4 h-4 ml-1" />
      )}
    </Button>
  );

  if (assignments.length === 0) {
    return (
      <div className="card-elegant p-8 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No assignments yet</h3>
        <p className="text-muted-foreground">Add your first assignment to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-left">
                  <SortButton field="className">Class</SortButton>
                </th>
                <th className="p-3 text-left">
                  <SortButton field="assignmentName">Assignment</SortButton>
                </th>
                <th className="p-3 text-left">
                  <SortButton field="dueDate">Due Date</SortButton>
                </th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">
                  <SortButton field="points">Points</SortButton>
                </th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left w-16"></th>
              </tr>
            </thead>
            <tbody>
              {sortedAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="p-3">
                    <Badge variant="outline" className="font-medium">
                      {assignment.className}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{assignment.assignmentName}</span>
                      {assignment.link && (
                        <a
                          href={assignment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${!assignment.dueDate ? 'text-muted-foreground' : ''}`}>
                      {formatDate(assignment.dueDate)}
                    </span>
                  </td>
                  <td className="p-3">
                    {assignment.description ? (
                      <span className="text-muted-foreground text-sm" title={assignment.description}>
                        {assignment.description.length > 50 
                          ? `${assignment.description.substring(0, 50)}...` 
                          : assignment.description
                        }
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${!assignment.points ? 'text-muted-foreground' : ''}`}>
                      {assignment.points || '?'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={assignment.completed}
                        onCheckedChange={(checked) => 
                          onUpdateAssignment(assignment.id, { completed: !!checked })
                        }
                      />
                      <span className={`text-sm ${assignment.completed ? 'text-success' : 'text-muted-foreground'}`}>
                        {assignment.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(assignment)}
                          className="text-primary"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteAssignment(assignment.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Assignment Dialog */}
      <Dialog open={!!editingAssignment} onOpenChange={(open) => !open && setEditingAssignment(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Class
              </Label>
              <Input
                id="className"
                value={editFormData.className || ''}
                onChange={(e) => handleInputChange('className', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignmentName" className="text-right">
                Assignment
              </Label>
              <Input
                id="assignmentName"
                value={editFormData.assignmentName || ''}
                onChange={(e) => handleInputChange('assignmentName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={editFormData.dueDate ? editFormData.dueDate.slice(0, 16) : ''}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={editFormData.points || ''}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                type="url"
                value={editFormData.link || ''}
                onChange={(e) => handleInputChange('link', e.target.value)}
                className="col-span-3"
                placeholder="https://"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={editFormData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingAssignment(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}