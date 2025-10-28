export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: number;
  dateOfJoining?: string | null;
  status?: boolean;
  managerId?: number | string | null;
  userId?: number | string | null;

  manager?: Employee | null;
  user?: {
    userId: number;
    username: string;
    email: string;
  };
}
