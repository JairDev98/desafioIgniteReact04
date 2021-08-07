import { SimpleGrid, useDisclosure } from '@chakra-ui/react';

import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [url, setUrl] = useState('');

  // TODO FUNCTION HANDLE VIEW IMAGE
  function handleViewImage(currUrl: string): void {
    setUrl(currUrl);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(topCard => (
          <Card
            data={topCard}
            key={topCard.id}
            viewImage={() => handleViewImage(topCard.url)}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={url} />
    </>
  );
}
