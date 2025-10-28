export interface UserRef { userId?: number; username?: string; }

export interface Employee {
  employeeId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: number;
  dateOfJoining?: string | null;
  status?: boolean;
  user?: UserRef | null;
  manager?: { employeeId?: number } | null;
}
