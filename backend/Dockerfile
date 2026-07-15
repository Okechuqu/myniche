FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_DEFAULT_TIMEOUT=120
ENV PIP_RETRIES=10
ENV POETRY_HTTP_TIMEOUT=120
ENV POETRY_HTTP_RETRIES=10
ENV POETRY_CACHE_DIR="/var/cache/pypoetry"
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* /app/
RUN poetry config virtualenvs.create false \
    && poetry config installer.parallel false \
    && poetry install --no-root --no-interaction --no-ansi

COPY . /app/

CMD ["gunicorn", "core.wsgi:application", "-c", "gunicorn.conf.py"]