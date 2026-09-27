import os
import sys
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
import uvicorn

app = FastAPI(title="MedHub HTTPS Gateway")

BACKEND_URL = "http://127.0.0.1:7860"

client = httpx.AsyncClient(timeout=600.0)

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"])
async def proxy_all(request: Request, path: str):
    url = f"{BACKEND_URL}/{path}"
    if request.url.query:
        url += f"?{request.url.query}"
    
    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    req = client.build_request(
        method=request.method,
        url=url,
        headers=headers,
        content=body
    )
    resp = await client.send(req, stream=True)
    
    excluded_headers = {"content-encoding", "content-length", "transfer-encoding", "connection"}
    response_headers = [
        (name, value) for name, value in resp.headers.items()
        if name.lower() not in excluded_headers
    ]
    
    async def body_stream():
        try:
            async for chunk in resp.aiter_bytes():
                yield chunk
        except Exception:
            pass
        finally:
            await resp.aclose()
    
    return StreamingResponse(
        body_stream(),
        status_code=resp.status_code,
        headers=dict(response_headers)
    )

if __name__ == "__main__":
    cert_path = os.path.join(os.path.dirname(__file__), "cert.pem")
    key_path = os.path.join(os.path.dirname(__file__), "key.pem")
    print(f"Starting MedHub HTTPS Gateway on https://0.0.0.0:7861 -> {BACKEND_URL}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=7861,
        ssl_certfile=cert_path,
        ssl_keyfile=key_path
    )
