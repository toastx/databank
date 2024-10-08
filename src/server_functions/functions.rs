use bcrypt::verify;
use reqwest::Client;
use reqwest::{multipart, Body};
use serde::Deserialize;
use serde_json::{self, json, Value};
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};

pub fn verify_password(stored_hash: &str, input_password: &str) -> bool {
    match verify(input_password, stored_hash) {
        Ok(valid) => valid,
        Err(_) => false,
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
    id:String,
    cid: String,
    mime_type: String,
}

impl FileList {
   
    pub fn to_json_vec(&self) -> Vec<serde_json::Value> {
        self.files.iter()
            .map(|file| json!({
                "name": file.name,
                "id": file.id,
                "cid": file.cid,
                "mime_type": file.mime_type,
            }))
            .collect()
    }
}

pub async fn delete_file(client: &Client, authorization: &String, id:String) -> anyhow::Result<String> {
    let url = format!("https://api.pinata.cloud/v3/files/{id}");
    println!("{}", url);
    let res = client
    .delete(url)
    .header("Authorization", format!("Bearer {}", authorization))
    .send()
    .await?;

    let response_text = res.text().await.unwrap();
    println!("{}", response_text);
    Ok(response_text)

}

pub async fn show_all_files(client: &Client, authorization: &String) -> anyhow::Result<Vec<Value>> {
    let res = client
        .get("https://api.pinata.cloud/v3/files")
        .header("Authorization", format!("Bearer {}", authorization))
        .send()
        .await?;

    let response_text = res.text().await.unwrap();
    let file_list = serde_json::from_str::<ShowResponse>(&response_text)?;
    Ok(file_list.data.to_json_vec())
}