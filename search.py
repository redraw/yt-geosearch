#!/usr/bin/python
import os

from bottle import Bottle, request, response, run, static_file
import youtube

app = Bottle()
youtube = youtube.YouTube()

STATIC_URL = os.path.dirname(os.path.abspath(__file__))


@app.route("/")
def index():
	return static_file('index.html', root=STATIC_URL)


@app.route("/search")
def search():
	params = request.query

	lat = params.get('lat')
	lng = params.get('lng')
	radius = params.get('radius')

	# quick validation
	if not all([lat, lng, radius]):
		response.status = 400
		return {'error': 'Check geo params.'}		

	location = "%s,%s" % (lat, lng)
	locationRadius = "%skm" % radius
	
	results = youtube.search(
		part=params.get('part', 'id'),
		type=params.get('type', 'video'),
		q=params.get('q'),
		location=location,
		locationRadius=locationRadius,
		order=params.get('order', 'date'),
		channelId=params.get('channelId'),
		maxResults=params.get('limit', 50),
		pageToken=params.get('next')
	)

	# extract video ids
	video_ids = youtube.extract_video_ids(results)

	# retrieve video results
	videos = youtube.videos(
		part="snippet,recordingDetails", 
		id=",".join(video_ids)
	)

	return {
		'videos': videos.get('items', []),
		'next': results.get('nextPageToken')
	}


run(app, reloader=True, debug=True, host='localhost', port=8080)