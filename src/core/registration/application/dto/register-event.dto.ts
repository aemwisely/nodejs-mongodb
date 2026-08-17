export interface CreateRegisterEvent {
  user: { firstName: string; lastName: string; phoneNumber: string };
  event_id: string;
}
