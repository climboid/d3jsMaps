import zipfile, glob, os 

from os.path import isfile 
fname = filter(isfile, glob.glob('*.zip')) 
for fname in fname:
  zipnames = [x for x in glob.glob('*.zip') if isfile(x)]
  for zipname in zipnames:
    zf =zipfile.ZipFile (zipname, 'r')
    for zfilename in zf.namelist(): # dont show the file built in
      newFile = open ( zfilename, "wb")
      newFile.write (zf.read (zfilename)) 
      newFile.close() 
      zf.close() 