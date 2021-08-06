import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = 0 }) => {
      const response = await api.get('api/images', {
        params: { after: pageParam },
      });

      return response.data;
    },
    { getNextPageParam: after => after || null }
  );

  const formattedData = useMemo(() => {
    const dataNew = data?.pages.map(image => image.data.flat());

    return dataNew;
  }, [data]);

  if (isLoading === true) {
    return <Loading />;
  }
  if (isError === true) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
