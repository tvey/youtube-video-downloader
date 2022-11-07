import os

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.utils import get_video_meta


app = FastAPI()
static_path = os.path.join(os.path.dirname(__file__), 'static/')
app.mount('/static', StaticFiles(directory=static_path), name='static')
templates = Jinja2Templates(directory='app')


@app.get('/', response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})


@app.post('/info')
async def get_meta(request: Request):
    data = await request.json()
    video = data.get('video')
    info = await get_video_meta(video)
    return info


@app.post("/video")
async def video_endpoint(request: Request):
    data = await request.json()
    video = data.get('video')
    resolution = data.get('resolution')

    return {'info': 'Got this', 'video': video, 'resolution': resolution}
