import { ComponentChildren, JSX } from 'preact';
import { useState } from 'preact/hooks';
import Button from './Button.tsx';
// import { IS_BROWSER } from '@fathym/eac/runtime/browser';

type CounterProps = JSX.HTMLAttributes<HTMLDivElement>;

export const IsIsland = true;

export default function Counter(props: CounterProps) {
  const [counter, setCounter] = useState(0);

  return (
    <div {...props} class='flex flex-row mx-auto'>
      <Button onClick={() => setCounter(counter + 1)}>
        Add to Count: {counter}
      </Button>
    </div>
  );
}
