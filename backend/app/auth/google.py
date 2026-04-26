import httpx
from fastapi import HTTPException, status
from ..config import settings


async def verify_google_token(token: str) -> dict:
    """Verify Google ID token via tokeninfo endpoint."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google sign-in failed. Please try again."
            )
        data = response.json()
        if not data.get("email"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not retrieve email from Google."
            )
        aud = data.get("aud", "")
        client_id = settings.GOOGLE_CLIENT_ID.strip()
        if client_id and aud != client_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token audience."
            )
        return data
