use actix_cors::Cors;
use actix_web::{
    web::{self, Json},
    App, HttpResponse, HttpServer, Responder,
};
use dotenv::dotenv;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use server_functions::functions::*;
use std::{env, sync::Arc};
mod server_functions;

struct AppState {
    client: Arc<Client>,
    jwt_secret: String,
    password: String,
    gateway: String,
}

#[derive(Deserialize)]
struct DeleteRequest {
    id: String,
}

#[derive(Deserialize)]
struct PasswordRequest {
    password: String,
}

#[derive(Serialize)]
struct PasswordResponse {
    success: bool,
    message: String,
}

async fn verify_password_handler(
    data: web::Json<PasswordRequest>,
    app_state: web::Data<AppState>,
) -> impl Responder {
    let input_password = &data.password;
    let stored_password = &app_state.password;
    let password_valid = verify_password(&stored_password, &input_password);
    if password_valid {
        HttpResponse::Ok().json(PasswordResponse {
            success: true,
            message: "Password is valid".to_string(),
        })
    } else {
        HttpResponse::Unauthorized().json(PasswordResponse {
            success: false,
            message: "Invalid password".to_string(),
        })
    }
}

async fn upload_file_handler(data: web::Data<AppState>) -> impl Responder {
    let client = data.client.clone();
    let authorization = &data.jwt_secret;

    match upload_file(&client, &authorization, "path_to_file".to_string()).await {
        Ok(_) => HttpResponse::Ok().body("File uploaded successfully"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to upload file"),
    }
}

async fn show_files_handler(data: web::Data<AppState>) -> impl Responder {
    println!("show files endpoint hit");
    let client = data.client.clone();
    let authorization = &data.jwt_secret;

    match show_all_files(&client, &authorization).await {
        Ok(json_objects) => HttpResponse::Ok().json(json_objects),
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch files"),
    }
}

async fn health_check() -> HttpResponse {
    println!("Health check endpoint hit");
    HttpResponse::Ok().json("Server is up and running")
}

async fn get_secrets_handler(data: web::Data<AppState>) -> impl Responder {
    println!("get secrets endpoint hit");
    let res = json!(
        {
            "pinataJwt":data.jwt_secret,
            "pinataGateway":data.gateway
        }
    );
    HttpResponse::Ok().json(res)
}

async fn delete_file_handler(
    data: web::Json<DeleteRequest>,
    app_state: web::Data<AppState>,
) -> impl Responder {
    println!("delete file endpoint hit");
    let id = &data.id;
    let client = app_state.client.clone();
    let authorization = &app_state.jwt_secret;
    match delete_file(&client, &authorization, id.to_string()).await {
        Ok(_) => HttpResponse::Ok().body("File deleted successfully"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to delete file"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let client = Arc::new(Client::new());
    let jwt_secret = env::var("jwt_secret").expect("JWT_SECRET not set");
    let password = env::var("hashed_password").expect("PASSWORD not set");
    let gateway = env::var("gateway").expect("GATEWAY not set");

    let app_data = web::Data::new(AppState {
        client,
        jwt_secret,
        password,
        gateway,
    });

    let _ = HttpServer::new(move || {
        App::new()
            .app_data(app_data.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .route("/upload", web::post().to(upload_file_handler))
            .route("/files", web::get().to(show_files_handler))
            .route("/verify_password", web::post().to(verify_password_handler))
            .route("/health", web::get().to(health_check))
            .route("/secrets", web::get().to(get_secrets_handler))
            .route("/delete", web::post().to(delete_file_handler))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await?;

    Ok(())
}
