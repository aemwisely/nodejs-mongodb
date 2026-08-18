export const UpdateWorkEventBody = {
  type: 'object',
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
      example: 50,
    },
    isActive: {
      type: 'boolean',
      example: true,
    },
  },
};
