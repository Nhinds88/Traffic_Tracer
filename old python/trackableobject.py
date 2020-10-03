Class TrackableObject:
    def __init__(self, objectID, centroid):
        # stores the object ID and inits a list centroids
        self.objectID = objectID
        self.centroids = [centroid]

        # Inits a boolean to check if the object has been counted or not
        self.counted = False