export const CreateWorkEventBody = {
  type: 'object',
  required: ['title', 'capacity'],
  properties: {
    title: {
      type: 'string',
      example: 'Backend Developer Registration',
    },
    description: {
      type: 'string',
      example: 'Registration round for backend developer test',
    },
    capacity: {
      type: 'integer',
      example: 10,
    },
    isActive: {
      type: 'boolean',
      example: true,
    },
  },
};
