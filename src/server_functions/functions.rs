use bcrypt::{hash, verify, DEFAULT_COST};
use dotenv::dotenv;
use reqwest::Client;
use reqwest::{multipart, Body};
use serde::Deserialize;
use serde_json;
use std::env;
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};

pub fn verify_password(stored_hash: &str, input_password: &str) -> bool {
    match verify(input_password, stored_hash) {
        Ok(valid) => valid,
        Err(_) => false,
    }
}

pub fn hash_password(plain_password: &str) -> String {
    match hash(plain_password, DEFAULT_COST) {
        Ok(hashed) => hashed,
        Err(_) => panic!("Error hashing password"),
    }
}

#[derive(Deserialize, Debug)]

struct UploadResponse {
    data: FileCID,
}

#[derive(Deserialize, Debug)]
struct FileCID {
    cid: String,
}

#[derive(Deserialize, Debug)]
struct ShowResponse {
    data: FileList,
}

#[derive(Deserialize, Debug)]
struct FileList {
    files: Vec<FileInfo>,
}

#[derive(Deserialize, Debug)]
struct FileInfo {
    name: String,
    cid: String,
    mime_type: String,
}

pub async fn upload_file(
    client: &Client,
    authorization: &String,
    filepath: String,
) -> anyhow::Result<()> {
    let name = "file2";
    let file = File::open(filepath).await?;
    let stream = FramedRead::new(file, BytesCodec::new());
    let file_body = Body::wrap_stream(stream);

    let some_file = multipart::Part::stream(file_body)
        .file_name(name)
        .mime_str("application/pdf")?;

    let form = multipart::Form::new().part("file", some_file);

    //send request
    let res = client
        .post("https://uploads.pinata.cloud/v3/files")
        .header("Authorization", format!("Bearer {}", authorization))
        .multipart(form)
        .send()
        .await?;

    let response_text = res.text().await.unwrap();

    let file_cid = serde_json::from_str::<UploadResponse>(&response_text).unwrap();
    println!("{}", file_cid.data.cid);

    Ok(())
}

pub async fn download_file() {
    todo!();
}

pub async fn show_all_files(client: &Client, authorization: &String) -> anyhow::Result<()> {
    let res = client
        .get("https://api.pinata.cloud/v3/files")
        .header("Authorization", format!("Bearer {}", authorization))
        .send()
        .await?;

    let response_text = res.text().await.unwrap();
    let file_list = serde_json::from_str::<ShowResponse>(&response_text)?;

    println!("{:?}", file_list.data.files);

    Ok(())
}