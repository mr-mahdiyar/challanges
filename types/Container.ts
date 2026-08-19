import { JSX } from "react";

type RenderFunction<T> = {
  render(parameters: T): JSX.Element;
};

export type ContainerProps<RenderParameters, Props = undefined> = Props extends undefined
  ? RenderFunction<RenderParameters>
  : RenderFunction<RenderParameters> & {
      [Property in keyof Props]: Props[Property];
    };
