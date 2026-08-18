export interface UpdateWorkEventDto {
  eventId: string;
  title?: string;
  description?: string;
  type?: string;
  capacity?: number;
  isActive?: boolean;
}
