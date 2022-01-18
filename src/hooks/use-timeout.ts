import * as React from 'react';

export const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = React.useRef(callback)

  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }

    const id = setTimeout(() => savedCallback.current(), delay)

    return () => clearTimeout(id)
  }, [delay])
}