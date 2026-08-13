import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  credentials: true,
  optionsSuccessStatus: 204,
  origin: (_origin, callback) => {
    callback(null, true);
  },
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
};
