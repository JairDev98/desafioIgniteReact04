import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: v =>
          v[0].size < 1048576000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v =>
          /image\/(jpeg|png|gif)/.test(v[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Titulo obrigatório',
      validate: {
        minValue: (ch: string) => ch.length > 2 || 'Mínimo de 2 caractres',
        maxValue: (ch: string) => ch.length < 20 || 'Máximo de 20 caractres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      validate: {
        maxLength: (ch: string) => ch.length < 65 || 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: Record<string, unknown>) => {
      await api.post('api/images', {
        ...data,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('api/images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();

  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro',
          status: 'error',
          duration: 9000,
        });
        return;
      }

      const { title, description } = data;

      const dataNew = { title, description, url: imageUrl };

      await mutation.mutateAsync(dataNew);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
        status: 'success',
        duration: 9000,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem',
        status: 'error',
        duration: 9000,
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
