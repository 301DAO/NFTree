import * as React from 'react';
import { useCopyToClipboard } from '../hooks';
import { CopyIcon } from './icon-components';

const CopyButton = React.memo(({ buttonText }: { buttonText: string }) => {
  const [copyButtonText, setCopyButtonText] = React.useState(buttonText);

  const [, copy] = useCopyToClipboard();

  const copyToClipboard = React.useCallback(async () => {
    await copy(window.location.href);
    setCopyButtonText('Copied');
    setTimeout(() => {
      setCopyButtonText('Copy profile link');
    }, 300);
  }, []);

  return (
    <button
      type="button"
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2 flex space-x-2 text-md"
      onClick={copyToClipboard}
    >
      <span>{copyButtonText}</span>
      <span>
        <CopyIcon />
      </span>
    </button>
  );
});

export default CopyButton;
