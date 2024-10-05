import { Box,Button,Container,Heading,Input,Text, VStack } from "@chakra-ui/react";
import {  UnlockIcon } from "@chakra-ui/icons";
import { useState } from "react";


export default function LoginPage() {
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const handleLogin = async () => {
        
        const response = await fetch('arbitrary-fleurette-toastx-68b8a5b6.koyeb.app/verify_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setError("");
            } else {
                setError(data.message); 
            }
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            setError('Server error: ' + errorData.message);
        }
    };
    

    return (
        <Container>
        <VStack>
            <Box width="400px" margin="auto" p={4}>
            <Heading
            as="h1"
            size="xl"
            marginBottom={10}
            color={"rosePink"}
            textAlign = "center">
                Login
            </Heading>
            <Input 
            textAlign = "center"
            bgColor={"seasalt"}
            color={"night"}
            size="lg"
            type = "password"
            placeholder="password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            />
            </Box>
        </VStack>
        <VStack>
            {error&&
            <Text 
            fontSize="xl"
            fontWeight={"bold"}
            color="red">
                {error}
                </Text>}
            <Button
            marginTop={10}
            color={"night"}
            bgColor={"rosePink"}
            onClick={handleLogin} 
            rightIcon={<UnlockIcon />}>
                Login
                </Button>
        </VStack>
        </Container>
        
        
    )

}
