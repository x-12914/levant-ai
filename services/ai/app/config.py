from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Loaded from environment / .env. See .env.example."""

    ai_host: str = "127.0.0.1"
    ai_port: int = 8792

    # Which LLM backend to use: "openai" (now) or "anthropic" (later).
    # Flip this one value to switch providers — no code change.
    ai_provider: str = "openai"

    # OpenAI (used while ai_provider == "openai")
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_sentiment_model: str = "gpt-4o-mini"

    # Anthropic (used while ai_provider == "anthropic")
    anthropic_api_key: str = ""
    claude_model: str = "claude-opus-4-8"
    claude_sentiment_model: str = "claude-haiku-4-5"

    secrets_master_key: str = ""

    # Read-only Alpaca connector (optional). Leave blank to stay on demo data.
    # Paper trading base: https://paper-api.alpaca.markets ; live: https://api.alpaca.markets
    alpaca_api_key: str = ""
    alpaca_api_secret: str = ""
    alpaca_base_url: str = "https://paper-api.alpaca.markets"

    database_url: str = ""
    redis_url: str = "redis://127.0.0.1:6379/3"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
