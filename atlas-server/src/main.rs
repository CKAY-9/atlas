use actix_cors::Cors;
use actix_web::{App, HttpServer};
use atlas_api::configure_api_routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .configure(configure_api_routes)
    })
    .bind(("0.0.0.0", 3001))?
    .run()
    .await
}
