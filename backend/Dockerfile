FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    set -ex && \
    apt-get -y -o Acquire::Check-Valid-Until=false --allow-releaseinfo-change update && \
    apt-get -y install  curl \
                        build-essential && \
    uv sync --frozen --no-install-project --no-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /api

# Aqui é copiada uma pasta do contexto definido no docker-compose.yml para o container
ADD ./app /api/app
ADD pyproject.toml /api/pyproject.toml
ADD uv.lock /api/uv.lock


RUN --mount=type=cache,target=/root/.cache/uv \
    addgroup --system python-group && \
    adduser --no-create-home --disabled-password --system --ingroup python-group python-user && \
    uv sync --frozen --no-dev && \
    chown -R python-user:python-group /usr /var /tmp /api

ENV PATH="/api/.venv/bin:$PATH"

USER python-user

EXPOSE 8000

ENTRYPOINT ["uvicorn", "app.main:api", "--host", "0.0.0.0", "--port", "8000"]