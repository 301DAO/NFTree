import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as React from 'react';
import { isValidEnsName, isValidEthAddress } from '../utils/string-validators';

const toaster = async (message: string) => {
  const { toast } = await import('react-hot-toast');
  return toast(message, {
    duration: 5000,
    position: 'bottom-right',
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff'
    }
  });
};

export const SearchBar = React.memo(
  ({ disabled, loading }: { disabled?: boolean; loading?: boolean }) => {
    const router = useRouter();
    const [searchInput, setSearchInput] = React.useState<string | null>(null);

    const goToAddressRoute = async () => {
      const search = searchInput?.trim();
      if (!search) return;
      const validSearch = isValidEthAddress(search) || isValidEnsName(search);
      if (!validSearch) {
        toaster(`Invalid input address. Must be a vlid ethereum address or a valid ENS name.`);
        return;
      }
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
      await goToAddressRoute();
    };

    const onEnterKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      await goToAddressRoute();
    };

    const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setSearchInput(event.target.value);
    };
    return (
      <div className="justify-center text-center bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 w-[26rem] h-10 rounded-t-lg pt-1">
        <input
          placeholder="Ethereum address or ENS name. . ."
          onKeyPress={onEnterKeyPress}
          onChange={onInputChange}
          className="bg-gray-50 active:outline-none outline-none focus:bg-white active:ring-0 border-b-0 rounded-t-md w-[98.2%] h-[93%] text-center placeholder-gray-400 focus:placeholder-transparent"
        />
        <button
          disabled={disabled || !searchInput?.length}
          className={clsx(
            `w-full text-white h-10 mb-12 font-semibold
          bg-gradient-to-r from-red-200 via-red-300 to-yellow-200
          hover:bg-gradient-to-bl focus:ring-red-100 dark:focus:ring-red-400
          rounded-b-lg text-sm px-5 py-2.5 text-center hover:cursor-pointer disabled:hover:cursor-default`,
            disabled && 'cursor-not-allowed hover:cursor-not-allowed',
            loading && 'cursor-wait hover:cursor-wait'
          )}
          onClick={onSearchClick}
        >
          SEARCH
        </button>
      </div>
    );
  }
);
