export type UserRole = 'interviewer' | 'candidate';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}
