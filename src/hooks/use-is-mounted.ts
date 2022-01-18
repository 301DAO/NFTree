import * as React from 'react';

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [isMounted])
  return isMounted
}