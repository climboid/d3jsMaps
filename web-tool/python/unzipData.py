import zipfile, glob, os 
from os.path import isfile 

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