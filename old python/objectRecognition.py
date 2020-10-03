# -*- coding: utf-8 -*-
"""
Created on Mon Aug 31 16:29:14 2020

@author: NicholasHinds
"""

import cv2 

# Works on facs, need to find a casacde for the human figure
# only works when head on

#video = cv2.VideoCapture('PexelsVideos1903270.mp4')
#video = cv2.VideoCapture('videoplayback.mp4')
#video = cv2.VideoCapture('productionID4463152.mp4')
video = cv2.VideoCapture(0)

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

while True:
    ret, frame = video.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    eyes = eye_cascade.detectMultiScale(gray, 1.3, 5)
    
    if ret == True:
        for (x,y,w,h) in faces:
             gray = cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
             font = cv2.FONT_HERSHEY_SIMPLEX
             cv2.putText(gray,'FACE',(x, y-10), font, 0.5, (11,255,255), 2, cv2.LINE_AA)
             roi_gray = gray[y:y+h, x:x+w]
        
        for (x,y,w,h) in eyes:
             gray = cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
             font = cv2.FONT_HERSHEY_SIMPLEX
             cv2.putText(gray,'EYES',(x, y-10), font, 0.5, (255,11,255), 2, cv2.LINE_AA)
             roi_gray = gray[y:y+h, x:x+w]
        
        cv2.imshow('VID', gray)
        
        if cv2.waitKey(5) == ord('x'):
            break
    else:
        break
    
cv2.destroyAllWindows()
video.release()