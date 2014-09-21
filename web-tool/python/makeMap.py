import urllib2

import zipfile, glob, os 
from os.path import isfile 

import os
from subprocess import call

def getCountry():
  countriesList = ["MEX","USA"];
  mapTypes = ["adm", "wat", "rds", "rrd"]

  # need to find a way to recover from 404
  # in order to continue loop
  for country in countriesList:
      for mapType in mapTypes:
          url = "http://biogeo.ucdavis.edu/data/diva/"+mapType+"/"+country+"_"+mapType+".zip"
          file_name = url.split('/')[-1]
          u = urllib2.urlopen(url)
          if u:
              f = open(file_name, 'wb')
              meta = u.info()
              file_size = int(meta.getheaders("Content-Length")[0])
              print "Downloading: %s Bytes: %s" % (file_name, file_size)

          file_size_dl = 0
          block_sz = 8192
          while True:
              buffer = u.read(block_sz)
              if not buffer:
                  break

              file_size_dl += len(buffer)
              f.write(buffer)
              status = r"%10d  [%3.2f%%]" % (file_size_dl, file_size_dl * 100. / file_size)
              status = status + chr(8)*(len(status)+1)
              print status,

          f.close()

  return

def unzip():
  fname = filter(isfile, glob.glob('*.zip')) 
  for fname in fname: 
    zipnames = filter(isfile, glob.glob('*.zip')) 
    for zipname in zipnames: 
      zf =zipfile.ZipFile (zipname, 'r') 
      for zfilename in zf.namelist(): 
        newFile = open ( zfilename, "wb") 
        newFile.write (zf.read (zfilename)) 
        newFile.close() 
      zf.close() 
  return



def loopAndTopo():
  for fn in os.listdir('.'):
    if os.path.isfile(fn):
      path = os.path.abspath(fn)
      fileExtension = os.path.splitext(path)
      if fileExtension[1] == '.shp':
        # print fn
        jsonName = fn[:-3] # all but the last 3 characters
        jsonName += 'json'
        call(["topojson", "-o", jsonName, fn])
  return

# execution of methods
getCountry()
unzip()
loopAndTopo()