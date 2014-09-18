# import requests, ZipFile, StringIO
# r = requests.get("http://biogeo.ucdavis.edu/data/diva/adm/ZWE_adm.zip")
# z = zipfile.ZipFile(StringIO.StringIO(r.content))
# z.extractall()

# done file types adm, wat, rds, rrd

import urllib2

countriesList = ["HRV"];
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
    