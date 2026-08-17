export interface RegisterEventUserInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface RegisterEventInput {
  user: RegisterEventUserInput;
  eventId: string;
}
