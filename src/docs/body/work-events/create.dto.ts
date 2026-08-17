export const CreateWorkEventBody = {
  type: 'object',
  required: ['title', 'capacity'],
  properties: {
    title: {
      type: 'string',
      example: 'string',
    },
    description: {
      type: 'string',
      example: 'string',
    },
    type: {
      type: 'string',
      example: 'string',
    },
    capacity: {
      type: 'integer',
      example: 0,
    },
    isActive: {
      type: 'boolean',
      example: true,
    },
  },
};
