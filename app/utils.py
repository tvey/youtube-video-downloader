import os

from pytube import YouTube


async def get_video_meta(video_url):
    video = YouTube(video_url)
    streams = (
        video.streams.filter(progressive=True, file_extension='mp4')
        .order_by('resolution')
        .desc()
    )
    return {
        'title': video.title,
        'resolutions': [s.resolution for s in streams],
    }


def download_video(video_url, path):
    pass
