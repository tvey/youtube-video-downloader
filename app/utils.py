import os

from pytube import YouTube


def download_video(video_url, path):
    yt = YouTube(video_url)
    yt = (
        yt.streams.filter(progressive=True, file_extension='mp4')
        .order_by('resolution')
        .desc()
        .first()
    )
    os.makedirs(path, exist_ok=True)
    yt.download(path)
