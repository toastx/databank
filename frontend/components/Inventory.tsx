import { Box, Flex, Button, Input, useDisclosure, Heading,Text, useToast } from '@chakra-ui/react';
import ItemCard from './ui/ItemCard';
import useFetchItems from './ui/FetchItems';

const InventoryPage = () => {
  const { items, isLoading, error } = useFetchItems();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      return;   
    }
    const fileName = file.name;
    const fileType = file.type;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('fileType', fileType)

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const   
 data = await response.json();
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        console.error('Failed to upload file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    
    <Flex h="100vh" w="full" justifyContent="space-between">
      
      <Box flex={1} p={4} bgColor={"richBlack"}>
      <Heading textAlign="center"color={"silverLakeBlue"}>FILES INVENTORY</Heading>
        {isLoading ? (
          <Text size="lg" paddingTop={4} textAlign="center"color={"silverLakeBlue"}>Loading...</Text>
        ) : error ? (
          <Text size="lg" paddingTop={4} textAlign="center"color={"silverLakeBlue"}>Error</Text>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.cid}
              item={item}
            />
          ))
        )}
      </Box>
      <Box flex={1} p={4} bg="gray.100">
        <Button colorScheme="blue" onClick={onOpen}>
          Upload File
        </Button>
        <Input
          type="file"
          display="none"
          onChange={handleUpload}
          ref={onOpen}
        />
        {/* Add other UI elements here, such as search bar, filters, etc. */}
      </Box>
    </Flex>
  );
};

export default InventoryPage;

