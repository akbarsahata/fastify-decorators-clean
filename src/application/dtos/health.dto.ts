import { Static, Type } from '@sinclair/typebox';

export const healthResponseItemDTO = Type.Object({
  uptime: Type.String(),
  date: Type.String(),
  status: Type.String(),
});

export const healthResponseDTO = Type.Object({
  code: Type.Integer(),
  data: healthResponseItemDTO,
});

export type HealthResponseItem = Static<typeof healthResponseItemDTO>;

export type HealthResponse = Static<typeof healthResponseDTO>;
