import type { LoginInput } from '../application/dto/login.dto';

export function BuildLoginInput(body: unknown): LoginInput {
  const payload = body as {
    phoneNumber?: string;
    phone_number?: string;
  };

  return {
    phoneNumber: payload.phoneNumber ?? payload.phone_number ?? '',
  };
}
