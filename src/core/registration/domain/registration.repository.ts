export interface RegistrationRepository {
  create(dto: { userId: string; eventId: string }): Promise<any>;
}
