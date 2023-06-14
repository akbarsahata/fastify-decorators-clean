import { Static, Type } from '@sinclair/typebox';

export const getManyProductResponseItemDTO = Type.Object({
  id: Type.String(),
  code: Type.String(),
  name: Type.String(),
  lastModified: Type.String({ format: 'date-time' }),
});

export const getManyProductResponseDTO = Type.Object({
  code: Type.Integer(),
  data: Type.Array(getManyProductResponseItemDTO),
});

export type GetManyProductResponseItem = Static<typeof getManyProductResponseItemDTO>;

export type GetManyProductResponse = Static<typeof getManyProductResponseDTO>;
