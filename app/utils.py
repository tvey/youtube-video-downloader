import io

from pytube import YouTube
from pytube.exceptions import VideoUnavailable


async def get_video_meta(video_url):
    video = YouTube(video_url)
    try:
        streams = (
            video.streams.filter(progressive=True, file_extension='mp4')
            .order_by('resolution')
            .desc()
        )
        return {
            'title': video.title,
            'resolutions': [s.resolution for s in streams],
        }
    except VideoUnavailable:
        return {}


async def get_video_url(video_url, resolution):
    video = YouTube(video_url)
    stream = video.streams.filter(res=resolution, progressive=True)[0]
    return {'url': stream.url}


async def get_video(video_url, resolution):
    video = YouTube(video_url)
    stream = video.streams.filter(res=resolution, progressive=True)[0]
    video_buffer = io.BytesIO()
    stream.stream_to_buffer(video_buffer)
    video_buffer.seek(0)

    return video_buffer
