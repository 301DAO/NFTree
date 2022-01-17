import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as React from 'react';
export const SearchBar = React.memo(
  ({ disabled, loading }: { disabled?: boolean; loading?: boolean }) => {
    const router = useRouter();
    const [searchInput, setSearchInput] = React.useState<string | null>(null);

    const goToAddressRoute = async ({ pathname, query }: { pathname: string; query: any }) => {
      if (!pathname || !query) return;
      router.push(
        {
          pathname: '/[address]',
          query: { address: searchInput }
        },
        undefined,
        { shallow: true }
      );
    };
    const onSearchClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const search = searchInput?.trim();
      await goToAddressRoute({ pathname: '/[address]', query: { address: searchInput } });
    };

    const onEnterKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const search = searchInput?.trim();
      await goToAddressRoute({ pathname: '/[address]', query: { address: search } });
    };

    const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setSearchInput(event.target.value);
    };
    return (
      <div className="justify-center text-center bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 w-[26rem] h-10 rounded-t-lg pt-1">
        <input
          placeholder=""
          onKeyPress={onEnterKeyPress}
          onChange={onInputChange}
          className="bg-gray-50 active:outline-none outline-none focus:bg-white active:ring-0 border-b-0 rounded-t-md w-[98.2%] h-[93%] text-center placeholder-gray-600 focus:placeholder-transparent"
        />
        <button
          disabled={disabled}
          className={clsx(
            `w-full text-white h-10 mb-12 font-semibold
          bg-gradient-to-r from-red-200 via-red-300 to-yellow-200
          hover:bg-gradient-to-bl focus:ring-red-100 dark:focus:ring-red-400
          rounded-b-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer`,
            disabled && 'cursor-not-allowed',
            loading && 'cursor-wait'
          )}
          onClick={onSearchClick}
        >
          SEARCH
        </button>
      </div>
    );
  }
);
