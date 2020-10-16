# -*- coding: utf-8 -*-
"""
Created on Tue Sep  1 11:34:28 2020

@author: NicholasHinds
"""
import cv2
import sys
import tools

def main():
    # cameraFeed = tools.cameraSource(sys.argv[1])
    print(sys.argv[1])
    print(sys.argv[2])
    print(sys.argv[3])
    print(sys.argv[4])
    print(sys.argv[5])
    print(sys.argv[6])
    print(sys.argv[7])
    print(sys.argv[8])

    # startPoint = tools.lineCoords(sys.argv[2], sys.argv[3])
    # endPoint = tools.lineCoords(sys.argv[4], sys.argv[5])

    # db = tools.dbConnnect("d1kb8x1fu8rhcnej.cbetxkdyhwsb.us-east-1.rds.amazonaws.com", "cg0qk6kstr07a5z4", "dw56x2swou8s05vw", "ljovr7av2qudtk53")
    
    # video = cv2.VideoCapture(cameraFeed)
    
    # tools.process_video(video, startPoint, endPoint, sys.argv[6], sys.argv[7], sys.argv[8], db)

if __name__ == "__main__":
    main()