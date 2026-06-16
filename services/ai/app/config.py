from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Loaded from environment / .env. See .env.example."""

    ai_host: str = "127.0.0.1"
    ai_port: int = 8082

    anthropic_api_key: str = ""
    claude_model: str = "claude-opus-4-8"
    claude_sentiment_model: str = "claude-haiku-4-5"

    secrets_master_key: str = ""

    database_url: str = ""
    redis_url: str = "redis://127.0.0.1:6379/3"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
