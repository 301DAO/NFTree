import * as React from 'react';

export const SkeletonCard = () => (
  <div className="w-full min-w-min max-w-xs h-full min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-2">
    <div className="pb-0 bg-gray-200 h-5/6 min-h-[14.5rem] p-2 rounded-md animate-pulse card translate-3d-none-after card translate-3d-none-after border"></div>
    <div className="pt-2 mt-2 h-2 bg-slate-200 rounded w-3/4"></div>
    <div className="flex flex-row justify-between align-bottom">
      <p className="pt-2 mt-2 h-2 bg-slate-200 rounded w-1/6"></p>
      <p className="pt-2 mt-2 h-2 bg-slate-200 rounded w-1/6"></p>
    </div>
  </div>
);
