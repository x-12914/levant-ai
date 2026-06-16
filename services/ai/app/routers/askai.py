from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..claude_client import classify_sentiment, stream_askai

router = APIRouter(prefix="/askai", tags=["askai"])


class AskRequest(BaseModel):
    prompt: str


class SentimentRequest(BaseModel):
    text: str


@router.post("/stream")
async def ask_stream(req: AskRequest) -> StreamingResponse:
    """Server-sent token stream for the AI Assistant chat."""

    async def event_source():
        async for chunk in stream_askai(req.prompt):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream")


@router.post("/sentiment")
async def sentiment(req: SentimentRequest) -> dict[str, str]:
    return {"sentiment": await classify_sentiment(req.text)}
