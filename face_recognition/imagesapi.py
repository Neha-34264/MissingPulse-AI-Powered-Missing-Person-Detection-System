from PIL import Image
from io import BytesIO
import io
from numpy import byte
import requests
import json
from images_update import makenew


# Using Api to add all photos fron database to folder to use for encoding to match 

def getimages():
  url="http://localhost:5000/api/missingpeople/getallpersons"
  mydata=requests.get(url)
  finaldata=mydata.json()
  # delete all previous photos using make new
  makenew()
  for i  in range(0,len(finaldata)):
    fdata=finaldata[i]['image']['data']['data']
    newobj=bytes(fdata)

    # the name of image is followed by (name_cnic) as there amy be multiple people with same cnic
    newname=finaldata[i]['name']+'_'+finaldata[i]['cnic']
    img=Image.open(io.BytesIO(newobj))
    img.save("./images/"+newname+".png")
  # print(newname)

