export interface GetAllParams<T = object> {
  select?: {
    [P in keyof T]?: boolean;
  };
  where?: Partial<T>;
  take?: number;
  skip?: number;
  order?: {
    [P in keyof T]?: 'ASC' | 'DESC';
  };
}

export interface GetOneParams<T = object> {
  select?: {
    [P in keyof T]?: boolean;
  };
  where?: Partial<T>;
}

export interface BaseRepository<T = object> {
  getAll(params: GetAllParams<T>): Promise<T[]>;
  getOne(params: GetOneParams<T>): Promise<T | null>;
}
