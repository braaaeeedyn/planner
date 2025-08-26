import { useState } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isValid, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

export default function CalendarView() {
  const { assignments } = useAssignments();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the calendar grid (weeks containing the month)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Group assignments by date
  const assignmentsByDate = assignments.reduce((acc, assignment) => {
    if (assignment.dueDate) {
      try {
        const date = parseISO(assignment.dueDate);
        if (isValid(date)) {
          const dateKey = format(date, 'yyyy-MM-dd');
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(assignment);
        }
      } catch (error) {
        console.error('Invalid date:', assignment.dueDate);
      }
    }
    return acc;
  }, {} as Record<string, typeof assignments>);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                📅 Calendar
              </h1>
              <p className="text-muted-foreground">
                View your assignments by due date
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="card-elegant p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="card-elegant p-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30 rounded-md"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayAssignments = assignmentsByDate[dateKey] || [];
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDay = isToday(day);

              return (
                <div
                  key={dateKey}
                  className={`min-h-24 p-2 rounded-md border transition-all duration-200 ${
                    isCurrentMonthDay 
                      ? 'bg-background border-border hover:bg-accent/50' 
                      : 'bg-muted/20 border-transparent text-muted-foreground'
                  } ${
                    isTodayDay ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isTodayDay ? 'text-primary' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAssignments.slice(0, 3).map(assignment => (
                      <div
                        key={assignment.id}
                        className={`text-xs p-1 rounded text-white truncate transition-all duration-200 hover:scale-105 cursor-pointer ${
                          assignment.completed 
                            ? 'bg-success/80 hover:bg-success' 
                            : 'bg-primary/80 hover:bg-primary'
                        }`}
                        title={`${assignment.className}: ${assignment.assignmentName}`}
                      >
                        <div className="font-medium truncate">
                          {assignment.assignmentName}
                        </div>
                        <div className="text-xs opacity-90 truncate">
                          {assignment.className}
                        </div>
                      </div>
                    ))}
                    
                    {dayAssignments.length > 3 && (
                      <div className="text-xs text-muted-foreground font-medium">
                        +{dayAssignments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="card-elegant p-4">
          <h3 className="text-sm font-semibold mb-3">Legend</h3>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Pending assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span>Completed assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/20 border-2 border-primary rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Assignments for today */}
        {(() => {
          const todayKey = format(new Date(), 'yyyy-MM-dd');
          const todayAssignments = assignmentsByDate[todayKey] || [];
          
          if (todayAssignments.length > 0) {
            return (
              <div className="card-elegant p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  📋 Due Today
                  <Badge variant="secondary" className="text-xs">
                    {todayAssignments.length}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {todayAssignments.map(assignment => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 bg-accent/30 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{assignment.assignmentName}</div>
                        <div className="text-sm text-muted-foreground">{assignment.className}</div>
                      </div>
                      <Badge variant={assignment.completed ? "default" : "secondary"}>
                        {assignment.completed ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}