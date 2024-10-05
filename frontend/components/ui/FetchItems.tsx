import { useState, useEffect } from 'react';

interface Item {
  cid: string;
  id:string,
  name: string;
  mime_type: string;
}

const useFetchItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('arbitrary-fleurette-toastx-68b8a5b6.koyeb.app/files');
        setError("")
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        
        setItems(data); 

      } catch (error)
 {
        setError('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, isLoading, error };
};

export default useFetchItems;