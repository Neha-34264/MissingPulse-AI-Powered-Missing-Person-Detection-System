import face_recognition
import cv2
import os
import glob
import numpy as np

class SimpleFacerec:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []

        # Resize frame for a faster speed
        self.frame_resizing = 0.25

    def load_encoding_images(self, images_path):
        """
        Load encoding images from the given directory.
        :param images_path: Directory containing the images.
        :return: None
        """
        # Load Images
        images_path = glob.glob(os.path.join(images_path, "*.*"))

        print("{} encoding images found.".format(len(images_path)))

        # Store image encoding and names
        for img_path in images_path:
            img = cv2.imread(img_path)
            
            # Check if image was successfully loaded
            if img is None:
                print(f"Error: Could not load image at {img_path}. Skipping...")
                continue
            
            # Convert image from BGR (OpenCV) to RGB (face_recognition)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Verify the image format
            if rgb_img.ndim != 3 or rgb_img.shape[2] != 3:
                print(f"Error: Expected RGB image but got shape: {rgb_img.shape}. Skipping...")
                continue

            # Get the filename only from the initial file path.
            basename = os.path.basename(img_path)
            (filename, ext) = os.path.splitext(basename)

            # Get encoding of the face image
            try:
                img_encoding = face_recognition.face_encodings(rgb_img)[0]
            except IndexError:
                print(f"Error: No face found in the image at {img_path}. Skipping...")
                continue

            # Store file name and file encoding
            self.known_face_encodings.append(img_encoding)
            self.known_face_names.append(filename)

        print("Encoding images loaded.")

    def detect_known_faces(self, frame):
        """
        Detect and recognize faces in the given frame.
        :param frame: The input image/frame.
        :return: face_locations, face_names: Detected face locations and corresponding names.
        """
        # Resize the frame to speed up face detection
        small_frame = cv2.resize(frame, (0, 0), fx=self.frame_resizing, fy=self.frame_resizing)

        # Convert image from BGR to RGB
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Ensure the image is in RGB format
        if rgb_small_frame.ndim != 3 or rgb_small_frame.shape[2] != 3:
            raise ValueError(f"Expected image in RGB format, but got shape: {rgb_small_frame.shape}")

        # Find face locations and encodings in the frame
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []

        for face_encoding in face_encodings:
            # Compare the detected face with known faces
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
            name = "Unknown"

            # Calculate the face distances and find the best match
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)

            # If a match is found, get the name of the matched face
            if matches[best_match_index]:
                name = self.known_face_names[best_match_index]
            face_names.append(name)

        # Adjust face locations based on resizing
        face_locations = np.array(face_locations)
        face_locations = face_locations / self.frame_resizing
        return face_locations.astype(int), face_names
