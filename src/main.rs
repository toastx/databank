use dotenv::dotenv;
use reqwest::Client;
use std::env;
mod server_functions;
use server_functions::functions::*;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let jwt_secret_token = env::var("jwt_secret").expect("jwt_secret must be set.");
    let client = Client::new();
    let password = "skibi toi";
    let hashed_password = env::var("hashed_password").expect("hashed_password must be set.");
    let is_valid = verify_password(&hashed_password, password);

    println!("Password is valid: {}", is_valid);
}
