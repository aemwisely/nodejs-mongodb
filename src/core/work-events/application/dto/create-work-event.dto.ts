export interface CreateWorkEventInput {
  title: string;
  description?: string;
  type: string;
  capacity: number;
  isActive?: boolean;
}
