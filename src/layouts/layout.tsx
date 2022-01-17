import * as React from 'react';
import { SearchBar } from '../components';
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-8 px-3 flex flex-col min-h-screen">
      <div className="flex flex-col items-center min-h-screen mt-10">
        <SearchBar />
        {children}
      </div>
    </div>
  )
}