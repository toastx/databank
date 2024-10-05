import { Box, Flex, Button, Input, useDisclosure, Heading, Text, useToast } from '@chakra-ui/react';
import ItemCard from './ui/ItemCard';
import useFetchItems from './ui/FetchItems';
import { PinataSDK } from 'pinata';
import { useState, useEffect, useRef } from 'react';

const InventoryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [pinata, setPinata] = useState<PinataSDK | null>(null);
  const { items, isLoading, error } = useFetchItems();
  const inputFileRef = useRef<HTMLInputElement | null>(null); // Use ref for file input

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch('https://arbitrary-fleurette-toastx-68b8a5b6.koyeb.app/secrets');
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!pinata) {
      console.error('Pinata SDK not initialized');
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }
    const fileName = file.name;
    const fileType = file.type;

    try {
      const final_file = new File([file], fileName, { type: fileType });
      const upload = await pinata.upload.file(final_file);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log(upload);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileUploadClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click(); // Programmatically click the file input
    }
  };

  return (
    <Flex h="100vh" w="full" justifyContent="space-between">
      <Box flex={1} p={4} bgColor={"richBlack"}>
        <Heading textAlign="center" color={"silverLakeBlue"}>FILES INVENTORY</Heading>
        {isLoading ? (
          <Text size="lg" paddingTop={4} textAlign="center" color={"silverLakeBlue"}>Loading...</Text>
        ) : error ? (
          <Text size="lg" paddingTop={4} textAlign="center" color={"silverLakeBlue"}>Error</Text>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.cid}
              item={item}
              onView={(itemId) => console.log(`Viewing item ${itemId}`)}
              onDelete={(itemId) => console.log(`Deleting item ${itemId}`)}
            />
          ))
        )}
      </Box>
      <Box flex={1} p={4} bg="gray.100">
        <Button colorScheme="blue" onClick={handleFileUploadClick}>
          Upload File
        </Button>
        <Input
          type="file"
          display="none"
          onChange={handleUpload}
          ref={inputFileRef} 
        />
      </Box>
    </Flex>
  );
};

export default InventoryPage;
