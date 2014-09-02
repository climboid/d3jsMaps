import os
from subprocess import call

for fn in os.listdir('.'):
  if os.path.isfile(fn):
    path = os.path.abspath(fn)
    fileExtension = os.path.splitext(path)
    if fileExtension[1] == '.shp':
      # print fn
      jsonName = fn[:-3] # all but the last 3 characters
      jsonName += 'json'
      call(["topojson", "-o", jsonName, fn])

    # country = fn
    # print country