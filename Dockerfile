FROM nginx:latest

RUN apt update
RUN apt install -y python3-full
RUN apt install -y procps

WORKDIR /flaskapp
RUN python3 -m venv /flaskapp/venv
COPY requirements.txt requirements.txt
RUN /flaskapp/venv/bin/pip install -r requirements.txt

COPY app.py app.py
COPY site.conf /etc/nginx/sites-available/flaskapp.conf
RUN ln -s /etc/nginx/sites-available/flaskapp.conf /etc/nginx/conf.d
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak

COPY start.sh start.sh
RUN chmod 777 start.sh

ENTRYPOINT "/flaskapp/start.sh"
