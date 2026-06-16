import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..llm import classify_sentiment, stream_askai

router = APIRouter(prefix="/askai", tags=["askai"])


class AskRequest(BaseModel):
    prompt: str


class SentimentRequest(BaseModel):
    text: str


@router.post("/stream")
async def ask_stream(req: AskRequest) -> StreamingResponse:
    """Server-sent token stream for the AI Assistant chat."""

    async def event_source():
        # JSON-encode each chunk so newlines/special chars survive SSE framing.
        async for chunk in stream_askai(req.prompt):
            yield f"data: {json.dumps(chunk)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream")


@router.post("/sentiment")
async def sentiment(req: SentimentRequest) -> dict[str, str]:
    return {"sentiment": await classify_sentiment(req.text)}
