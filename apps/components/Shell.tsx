import { ComponentChildren, JSX } from 'preact';
// import { IS_BROWSER } from '@fathym/eac/runtime/browser';

type ShellProps = {
  value: string;
  children: ComponentChildren;
} & JSX.HTMLAttributes<HTMLAnchorElement>;

export const IsIsland = true;

export default function Shell(props: ShellProps) {
  typeof document !== 'undefined' && console.log(props.value);

  return <>{props.children}</>;
}
