import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useMounted } from '../hooks';

const Home: NextPage = () => {
  const router = useRouter();
  const mounted = useMounted();

  return <div className=""></div>;
};

export default Home;
