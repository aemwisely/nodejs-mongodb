import { CreateWorkEventInput } from '../application/dto/create-work-event.dto';

export function BuildWorkEventInput(body: unknown): CreateWorkEventInput {
  const payload = body as Partial<CreateWorkEventInput> & { is_active?: boolean };

  return {
    title: payload.title ?? '',
    description: payload.description,
    type: payload.type ?? '',
    capacity: Number(payload.capacity),
    isActive: payload.isActive ?? payload.is_active,
  };
}
