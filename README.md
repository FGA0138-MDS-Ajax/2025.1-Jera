# template-repository - Branch Developer

Template de Repositório para a matéria de Métodos de Desenvolvimento de Software lecionado pelo professor Ricardo Ajax.

Essa Branch deve ser usada exclusivamente para a versão de desenvolvimento do software antes de ir para produção.

## Especificações Técnicas do Repositório

Este repositório é planejado e estruturado para que seja realizado documentações de software. Caso haja outra necessidades, deve-se consultar a professora.

Atualmente se usa a ferramenta MkDocs para gerar sua documentação baseado nos seus arquivos markdowns, vocês podem achar mais instruções sobre o MkDocs através do link da documentação da ferramenta: [https://www.mkdocs.org/](https://www.mkdocs.org/).

Também é usado uma "sub-ferramenta" do MkDocs para sua estilização, o Material Theme, que pode ser consultado através do link: [https://squidfunk.github.io/mkdocs-material/](https://squidfunk.github.io/mkdocs-material/).

Este repositório também conta com uma pipeline de automatização de deploy do seu conteúdo MkDocs, para que a cada commit feito na main, a pipeline gere uma versão atualizada da sua documentação em minutos. Vale ressaltar que é importante realizar uma configuração para que tudo funcione da forma correta, as instruções são as seguintes:

* Acesse as configurações do repositório;
* Procure a aba de "Pages"
* Em "Source" escolha a opção "Deploy from a branch";
* Em "Branch" escolha "gh-pages";
* Clique em salvar e pronto;

Após essas etapas de configuração, o seu GitPages deve funcionar normalmente.

## Configuração e Deploy

### Configuração do Ambiente

1. Copie o arquivo de exemplo das variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas configurações específicas:
   - `BACKEND_URL`: URL do backend API (ex: `https://api.floragest.liander.dev` para produção)
   - Configurações do banco de dados PostgreSQL
   - Outras variáveis conforme necessário

### Configuração do Nginx

O frontend usa nginx como servidor web e proxy reverso. A configuração é flexível e permite:

- **Desenvolvimento local**: Usa `http://api:8000` (container Docker)
- **Produção**: Configurável via variável `BACKEND_URL`

#### Configuração via Variáveis de Ambiente

Para alterar a URL do backend, defina a variável `BACKEND_URL` no arquivo `.env`:

```env
# Para desenvolvimento local
BACKEND_URL=http://api:8000

# Para produção
BACKEND_URL=https://api.floragest.liander.dev
```

### Deploy Local com Docker

```bash
# Build e inicialização dos serviços
docker-compose up --build

# Apenas inicialização (se já foi feito build)
docker-compose up
```

### Estrutura do Projeto

- **Frontend**: React + TypeScript + Vite, servido via nginx
- **Backend**: FastAPI + Python
- **Banco de Dados**: PostgreSQL
- **Infraestrutura**: Terraform (AWS)

### Deploy para AWS

#### Deploy Completo (Backend + Frontend)

```bash
# Deploy completo - backend e frontend
cd infra && \
BACKEND_ECR_URI=$(tofu output -raw ecr_repository_url) && \
FRONTEND_ECR_URI=$(tofu output -raw frontend_ecr_repository_url) && \
BACKEND_URL=$(tofu output -raw backend_api_url) && \
echo "Deploying Backend to: $BACKEND_ECR_URI" && \
echo "Deploying Frontend to: $FRONTEND_ECR_URI" && \
echo "Backend URL: $BACKEND_URL" && \
aws ecr get-login-password --region sa-east-1 | sudo docker login --username AWS --password-stdin $BACKEND_ECR_URI && \
echo "Building and pushing backend..." && \
sudo docker build -t floragest-backend ../backend && \
sudo docker tag floragest-backend:latest $BACKEND_ECR_URI:latest && \
sudo docker push $BACKEND_ECR_URI:latest && \
echo "Building and pushing frontend..." && \
sudo docker build --build-arg BACKEND_URL=$BACKEND_URL -t floragest-frontend ../frontend && \
sudo docker tag floragest-frontend:latest $FRONTEND_ECR_URI:latest && \
sudo docker push $FRONTEND_ECR_URI:latest && \
echo "Updating ECS services..." && \
aws ecs update-service --cluster floragest-cluster --service floragest-backend-service --force-new-deployment --region sa-east-1 && \
aws ecs update-service --cluster floragest-cluster --service floragest-frontend-service --force-new-deployment --region sa-east-1 && \
echo "Deployment completed!"
```

#### Deploy Apenas Backend

```bash
cd infra && \
ECR_URI=$(tofu output -raw ecr_repository_url) && \
aws ecr get-login-password --region sa-east-1 | sudo docker login --username AWS --password-stdin $ECR_URI && \
sudo docker build -t floragest-backend ../backend && \
sudo docker tag floragest-backend:latest $ECR_URI:latest && \
sudo docker push $ECR_URI:latest && \
aws ecs update-service --cluster floragest-cluster --service floragest-backend-service --force-new-deployment --region sa-east-1
```

#### Deploy Apenas Frontend

```bash
cd infra && \
FRONTEND_ECR_URI=$(tofu output -raw frontend_ecr_repository_url) && \
BACKEND_URL=$(tofu output -raw backend_api_url) && \
aws ecr get-login-password --region sa-east-1 | sudo docker login --username AWS --password-stdin $FRONTEND_ECR_URI && \
sudo docker build --build-arg BACKEND_URL=$BACKEND_URL -t floragest-frontend ../frontend && \
sudo docker tag floragest-frontend:latest $FRONTEND_ECR_URI:latest && \
sudo docker push $FRONTEND_ECR_URI:latest && \
aws ecs update-service --cluster floragest-cluster --service floragest-frontend-service --force-new-deployment --region sa-east-1
```

### URLs de Acesso

- **Frontend**: https://floragest.liander.dev
- **Backend API**: https://api.floragest.liander.dev

### Terraform Outputs


alb_dns_name = "floragest-alb-1445168795.sa-east-1.elb.amazonaws.com"
app_secret_arn = "arn:aws:secretsmanager:sa-east-1:965134913902:secret:floragest/db/app-sa-east-1-JVRUrS"
backend_api_url = "https://api.floragest.liander.dev"
ecr_repository_url = "965134913902.dkr.ecr.sa-east-1.amazonaws.com/floragest-backend"
ecs_cluster_name = "floragest-cluster"
ecs_service_name = "floragest-backend-service"
frontend_alb_dns_name = "floragest-frontend-alb-1590008570.sa-east-1.elb.amazonaws.com"
frontend_ecr_repository_url = "965134913902.dkr.ecr.sa-east-1.amazonaws.com/floragest-frontend"
frontend_ecs_service_name = "floragest-frontend-service"
frontend_url = "https://floragest.liander.dev"
master_secret_arn = "arn:aws:secretsmanager:sa-east-1:965134913902:secret:floragest/db/master-sa-east-1-pt7asd"
rds_endpoint = "floragest-postgres.cg0xm64hbsqi.sa-east-1.rds.amazonaws.com"
rds_port = 5432
vpc_id = "vpc-0ff50e79be3615799"


host = db.floragest.liander.dev
port = 5432
database = floragest
username = floragest_app
password = backend-jera