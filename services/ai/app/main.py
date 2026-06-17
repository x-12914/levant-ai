from fastapi import FastAPI

from .config import settings
from .routers import accounts, askai, health

app = FastAPI(title="Levant AI Service", version="0.1.0")
app.include_router(health.router)
app.include_router(askai.router)
app.include_router(accounts.router)


def run() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host=settings.ai_host, port=settings.ai_port, reload=False)


if __name__ == "__main__":
    run()
