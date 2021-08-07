import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.600" maxH="600px" maxW="900px">
        <Image src={imgUrl} borderTopRadius="md" />

        <ModalFooter
          bgColor="pGray.800"
          display="flex"
          justifyContent="left"
          borderBottomRadius="md"
        >
          <Link href={imgUrl}> Abrir original </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
