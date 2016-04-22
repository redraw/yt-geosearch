import os
from googleapiclient.discovery import build

DEVELOPER_KEY = os.getenv('GOOGLE_API_KEY')


class YouTube(object):
    def __init__(self, *args, **kwargs):
        self.service = build('youtube', 'v3', developerKey=DEVELOPER_KEY)

    def search(self, **kwargs):
        data = self.service.search().list(**kwargs).execute()
        return data

    def videos(self, ids=[], **kwargs):
        data = self.service.videos().list(**kwargs).execute()
        return data

    @staticmethod
    def extract_video_ids(data):
        return [item['id']['videoId'] for item in data.get("items", [])]

    # @staticmethod
    # def parse(data):
    #   """ Parse Youtube response based on "kind" """
    #   parsed = {}

    #   if data.get('kind') == "youtube#videoListResponse":
    #       for item in data.get('items', []):
    #           if 'snippet' in item:
    #               snippet = item['snippet']
    #               parsed.update({
    #                   'title': snippet['title'],
    #                   'thumbnail': snippet['thumbnail']['high'],
    #                   'publishedAt': snippet['publishedAt']
    #               })
    #           if 'recordingDetails' in item:
    #               location = item['recordingDetails']['location']
    #               parsed.update({
    #                   'location': {
    #                       'lat': location['latitude'],
    #                       'lng': location['longitude']
    #                   }
    #               })

    #   return parsed
