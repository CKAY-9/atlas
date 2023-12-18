<div align="center">
    <img src="./assets/logo.png" width="200" height="200" />
</div>

# Atlas
Empowering education, one classroom at a time.

## About
Atlas is a web platform dedicated to making sure education is accessible to everyone. Atlas includes features that allows educators
and students to interact and engage online. These features are meant to empower students and teachers to make sure they have the
best expierence learning and teaching.

## Developing

### Folder Structure
- atlas-frontend: NextJS web application
- atlas-server: Actix and Diesel rust API
- assets: General assets

### Running
```
git clone https://github.com/CKAY-9/atlas.git
cd atlas

# Frontend
cd atlas-frontend
npm i
# setup .env
npm run dev # or build

# Server / API
cd atlas-server
# setup .env
cargo run
```
