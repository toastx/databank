# **File Inventory Application**

A web-based file inventory application that allows users to upload and manage files using Pinata's IPFS service.

## **Prerequisites**

- Rust: Backend development
- Node.js: Frontend development
- Pinata Account: For IPFS file storage

## **Steps to Set Up**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/toastx/databank.git
   cd databank
   ```
---
2. **Create .env File**

   In the root directory, create a `.env` file with the following content:

   ```bash
   jwt_secret = <Your_JWT_Secret>
   hashed_password = <Your_BCrypt_Hashed_Password>
   gateway = <Your_Pinata_Gateway_URL>
   ```

   You can obtain your `jwt_secret` and `gateway` from your Pinata account (see the next step).
---
3. **Set Up Pinata IPFS Account**

   Go to Pinata IPFS and create an account. Once registered:

   - Navigate to API Keys in your Pinata dashboard.
   - Create a new key with the necessary permissions and obtain your JWT Secret and Gateway URL.
   - Add these values to your `.env` file.
---
4. **Create a Hashed Password (For Rust)**

   You'll need to generate a hashed password using bcrypt. This password will be used for securing your backend API.

   You can use this command in Rust to generate a hashed password:

   ```rust
   use bcrypt::{hash, DEFAULT_COST};

   fn main() {
       let password = "your_password";
       let hashed_password = hash(password, DEFAULT_COST).unwrap();
       println!("Hashed Password: {}", hashed_password);
   }
   ```

   Add the generated password to the `hashed_password` field in your `.env` file.

   *Note : A file will be added soon to simplify this process.*
---
5. **Install Frontend Dependencies**

   Navigate to the frontend directory and install the required dependencies:

   ```bash
   cd frontend
   npm install
   ```
---
6. **Build and Run the Application**

   Build the Rust backend and run the frontend in development mode:

   ```bash
   cargo build
   npm run dev
   ```

   This will launch the application locally. You can now access it at http://localhost:3000.



## **Issues or Contributions**

Feel free to open an issue or contribute to the project by creating a pull request.



# **Happy coding! 🎉**
