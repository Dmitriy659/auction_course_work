# Auction course work

This is a client-server application for auctions.

## Technologies used

- **Backend**: Python, Django, Django REST Framework (DRF), Gunicorn  
- **Frontend**: React  
- **Web-сервер**: Nginx  
- **Containerization**: Docker

---

## Preparation before the project launch

Before starting the project, you need to create a `.env` file and enter the database data for the project.

---

## Launching the project locally

### 1. Cloning a repository

```bash
git clone https://github.com/Dmitriy659/foodgram-st.git](https://github.com/Dmitriy659/auction_course_work.git
```

### 2. Installing Docker, Docker-compose
```bash
sudo apt update
sudo apt install curl                                   # installing the file download utility
curl -fsSL https://get.docker.com -o get-docker.sh      # download the installation script
sh get-docker.sh                                        # running the script
sudo apt-get install docker-compose-plugin
```
### 3. Create images and containers using the command below
```bash
docker compose up
```
