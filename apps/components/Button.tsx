import { JSX } from 'preact';

type ButtonProps = JSX.HTMLAttributes<HTMLAnchorElement>;

export const IsIsland = true;

export default function Button(props: ButtonProps) {
  return (
    <>
      <a
        class='rounded px-4 py-2 bg-blue-500'
        {...props}
        onClick={() => alert('Hey 1')}
      >
        EaC Runtime
      </a>

      <a
        class='rounded px-4 py-2 bg-blue-500'
        {...props}
        onClick={() => alert('Hey 2')}
      >
        EaC Runtime
      </a>
    </>
  );
}
