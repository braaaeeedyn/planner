import { useState, useEffect } from 'react';
import { Assignment } from '@/types/assignment';

const STORAGE_KEY = 'homework-tracker-assignments';

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAssignments(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    }
  }, []);

  const saveAssignments = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssignments));
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
    };
    saveAssignments([...assignments, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    const updated = assignments.map(assignment =>
      assignment.id === id ? { ...assignment, ...updates } : assignment
    );
    saveAssignments(updated);
  };

  const deleteAssignment = (id: string) => {
    saveAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  return {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  };
}