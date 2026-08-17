import type { RegisterEventInput } from '../application/dto/register-event.dto';

export function BuildRegisterEventInput(body: unknown): RegisterEventInput {
  const payload = body as {
    eventId?: string;
    event_id?: string;
    user?: {
      firstName?: string;
      first_name?: string;
      lastName?: string;
      last_name?: string;
      phoneNumber?: string;
      phone_number?: string;
    };
  };

  return {
    eventId: payload.eventId ?? payload.event_id ?? '',
    user: {
      firstName: payload.user?.firstName ?? payload.user?.first_name ?? '',
      lastName: payload.user?.lastName ?? payload.user?.last_name ?? '',
      phoneNumber: payload.user?.phoneNumber ?? payload.user?.phone_number ?? '',
    },
  };
}
