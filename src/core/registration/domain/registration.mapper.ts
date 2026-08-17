import type { RegisterEventInput } from '../application/dto/register-event.dto';

export function BuildRegisterEventInput(eventId: string, body: unknown): RegisterEventInput {
  const payload = body as {
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    phoneNumber?: string;
    phone_number?: string;
  };

  return {
    eventId,
    user: {
      firstName: payload.firstName ?? payload.first_name ?? '',
      lastName: payload.lastName ?? payload.last_name ?? '',
      phoneNumber: payload.phoneNumber ?? payload.phone_number ?? '',
    },
  };
}
