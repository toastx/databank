import { Box, HStack, Text, IconButton,useToast } from '@chakra-ui/react';
import { ViewIcon, DeleteIcon } from '@chakra-ui/icons';
import { PinataSDK } from 'pinata'; // Import Pinata SDK
import { useState, useEffect } from 'react';

interface ItemCardProps {
  item: {
    id: string;
    cid: string;
    name: string;
    mime_type: string;
  };
  onView: (itemId: string) => void;
  onDelete: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onView, onDelete }) => {
  const [pinata, setPinata] = useState<PinataSDK | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/secrets');
        const data = await response.json();
        const pinataJwt = data.pinataJwt;
        const pinataGateway = data.pinataGateway;
        setPinata(new PinataSDK({ pinataJwt, pinataGateway }));
      } catch (error) {
        console.error('Failed to fetch Pinata credentials:', error);
      }
    };

    fetchCredentials();
  }, []);

  const handleView = async () => {
    if (!pinata) {
      console.error('Pinata SDK not initialized');
      return;
    }

    try {
      const url = await pinata.gateways.createSignedURL({
        cid: item.cid,
        expires: 1800, 
      });
      window.open(url, '_blank'); 
    } catch (error) {
      console.error('Error creating signed URL:', error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id }),
      });
      console.log(response)
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        console.error('Failed to delete item:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Box
      borderRadius={4}
      p={2}
      m={2}
      bg={"silverLakeBlue"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text color={"richBlack"} fontWeight="bold">{item.name}</Text>
      <HStack spacing={2}>
        <IconButton icon={<ViewIcon />} size="sm" colorScheme="blue" aria-label={'View File'} onClick={handleView} />
        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" aria-label={'Delete Item'} onClick={handleDelete} />
      </HStack>
    </Box>
  );
};

export default ItemCard;

