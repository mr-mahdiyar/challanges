import { Dispatch, SetStateAction } from "react";

export type Context<K extends string, T> = ({
      [P in K]: T;
    } & {
      [P in `set${Capitalize<K>}`]: Dispatch<SetStateAction<T>>;
    })
  | null;