#imagem base
FROM python:3.10-slim 

#variavel de ambiente para compilação de python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /JERA
#install build essencials
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

#copia e instala "requirements"
COPY ./requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . .

CMD ["python","app_teste.py"]