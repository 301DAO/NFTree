import clsx from 'clsx';
import * as React from 'react';

const LoadMoreButton = React.memo(
  ({
    disabled,
    loading,
    onLoadMoreClick,
    loadMoreRef
  }: {
    disabled?: boolean;
    loading?: boolean;
    onLoadMoreClick: () => Promise<any>;
    loadMoreRef: React.RefObject<HTMLButtonElement>;
  }) => (
    <button
      disabled={disabled}
      ref={loadMoreRef}
      type="button"
      className={clsx(
        'dark:text-white dark:hover:text-gray-900',
        'mt-10 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 hover:text-white rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-400 hover:cursor-pointer',
        disabled && 'cursor-not-allowed invisible',
        loading && 'cursor-wait'
      )}
      onClick={onLoadMoreClick}
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ">
        {loading ? 'LOADING' : 'LOAD MORE'}
      </span>
    </button>
  )
);

export default LoadMoreButton;
