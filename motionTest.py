import cv2 

video = cv2.VideoCapture('PexelsVideos1903270.mp4')
subtractor = cv2.createBackgroundSubtractorMOG2(20, 50)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

while True:
    ret, frame = video.read()
    
    if ret == True:
        mask = subtractor.apply(frame)
        
        cv2.imshow('Mask', mask)
        
        if cv2.waitKey(5) == ord('x'):
            break
    else:
        break
    
cv2.destroyAllWindows()
video.release()