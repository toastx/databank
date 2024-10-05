FROM rust:latest
WORKDIR /app/databank
COPY Cargo.toml Cargo.lock ./
COPY ./src ./src
RUN cargo fetch

RUN cargo build --release

CMD ["cargo", "run", "--release"]
