import { ComponentChildren, JSX } from 'preact';

type Button2Props = {
  children: ComponentChildren;
} & JSX.HTMLAttributes<HTMLAnchorElement>;

export const IsIsland = true;

export default function Button2(props: Button2Props) {
  return (
    <a
      class='rounded px-4 py-2 bg-green-500'
      {...props}
      onClick={() => alert(props.children)}
    >
      EaC Runtime
    </a>
  );
}
