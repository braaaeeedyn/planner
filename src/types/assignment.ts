export interface Assignment {
  id: string;
  className: string;
  assignmentName: string;
  dueDate?: string;
  description?: string;
  link?: string;
  points?: number;
  completed: boolean;
}

export type Theme = 'white-gold' | 'sunset' | 'ocean' | 'forest' | 'cherry' | 'midnight';

export type SortField = 'dueDate' | 'className' | 'points' | 'assignmentName';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}