import face_recognition
import numpy as np
import cv2
import base64
from PIL import Image
import io
import logging
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FaceRecognitionService:
    """Service for face recognition operations"""
    
    def __init__(self):
        self.tolerance = Config.FACE_RECOGNITION_TOLERANCE
    
    def decode_base64_image(self, base64_string):
        """Decode base64 image string to numpy array"""
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_string)
            
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Ensure image is in RGB mode (not RGBA, P, L, etc.)
            if image.mode != 'RGB':
                # Convert to RGB (8-bit, 3 channels)
                image = image.convert('RGB')
            
            # Convert PIL Image to RGB numpy array (uint8)
            image_array = np.array(image, dtype=np.uint8)
            
            # Verify array format
            if len(image_array.shape) != 3 or image_array.shape[2] != 3:
                logger.error(f"Invalid image shape: {image_array.shape}")
                return None
            
            if image_array.dtype != np.uint8:
                logger.error(f"Invalid image dtype: {image_array.dtype}")
                return None
            
            return image_array
        except Exception as e:
            logger.error(f"Error decoding base64 image: {e}")
            return None
    
    def extract_face_encoding(self, image_data):
        """
        Extract face encoding from image data
        
        Args:
            image_data: Can be base64 string or numpy array
        
        Returns:
            Face encoding as list or None if no face found
        """
        try:
            # Convert to numpy array if base64 string
            if isinstance(image_data, str):
                image_array = self.decode_base64_image(image_data)
                if image_array is None:
                    return None, "Failed to decode image. Please ensure image is in valid format."
            else:
                image_array = image_data
                # Ensure numpy array is uint8 RGB
                if image_array.dtype != np.uint8:
                    image_array = image_array.astype(np.uint8)
            
            # Verify image array is valid
            if not isinstance(image_array, np.ndarray):
                return None, "Invalid image data format"
            
            if len(image_array.shape) != 3:
                return None, "Image must be RGB (3 channels)"
            
            if image_array.shape[2] not in [3, 4]:
                return None, "Image must have 3 (RGB) or 4 (RGBA) channels"
            
            # Convert RGBA to RGB if needed
            if image_array.shape[2] == 4:
                # Remove alpha channel
                image_array = image_array[:, :, :3]
            
            # Ensure dtype is uint8
            if image_array.dtype != np.uint8:
                image_array = image_array.astype(np.uint8)
            
            logger.info(f"Processing image with shape: {image_array.shape}, dtype: {image_array.dtype}")
            
            # Find face locations
            face_locations = face_recognition.face_locations(image_array)
            
            if len(face_locations) == 0:
                return None, "No face detected in the image. Please ensure your face is clearly visible."
            
            if len(face_locations) > 1:
                return None, "Multiple faces detected. Please ensure only one face is visible."
            
            # Get face encoding
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            if len(face_encodings) == 0:
                return None, "Could not encode face. Please try again with better lighting."
            
            # Convert numpy array to list for MongoDB storage
            face_encoding = face_encodings[0].tolist()
            
            logger.info("Face encoding extracted successfully")
            return face_encoding, "Face encoding extracted successfully"
            
        except Exception as e:
            logger.error(f"Error extracting face encoding: {e}")
            return None, f"Error processing face: {str(e)}"
    
    def compare_faces(self, known_encoding, unknown_encoding):
        """
        Compare two face encodings
        
        Args:
            known_encoding: Stored face encoding (list)
            unknown_encoding: New face encoding to compare (list)
        
        Returns:
            Boolean indicating if faces match
        """
        try:
            # Convert lists back to numpy arrays
            known_array = np.array(known_encoding)
            unknown_array = np.array(unknown_encoding)
            
            # Calculate face distance
            face_distance = face_recognition.face_distance([known_array], unknown_array)[0]
            
            # Check if faces match within tolerance
            matches = face_distance <= self.tolerance
            
            confidence = (1 - face_distance) * 100
            
            logger.info(f"Face comparison - Match: {matches}, Distance: {face_distance:.4f}, Confidence: {confidence:.2f}%")
            
            return matches, confidence
            
        except Exception as e:
            logger.error(f"Error comparing faces: {e}")
            return False, 0.0
    
    def find_matching_face(self, face_encoding, user_encodings):
        """
        Find a matching face from a list of known encodings
        
        Args:
            face_encoding: Face encoding to match (list)
            user_encodings: List of dicts with 'voter_id' and 'face_encoding'
        
        Returns:
            voter_id of matching user or None
        """
        try:
            unknown_array = np.array(face_encoding)
            
            for user in user_encodings:
                known_array = np.array(user['face_encoding'])
                
                # Calculate face distance
                face_distance = face_recognition.face_distance([known_array], unknown_array)[0]
                
                if face_distance <= self.tolerance:
                    confidence = (1 - face_distance) * 100
                    logger.info(f"Match found - Voter ID: {user['voter_id']}, Confidence: {confidence:.2f}%")
                    return user['voter_id'], confidence
            
            return None, 0.0
            
        except Exception as e:
            logger.error(f"Error finding matching face: {e}")
            return None, 0.0
    
    def enhance_image(self, image_array):
        """Apply image enhancement for better face detection"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
            
            # Apply histogram equalization
            enhanced = cv2.equalizeHist(gray)
            
            # Convert back to RGB
            enhanced_rgb = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)
            
            return enhanced_rgb
        except Exception as e:
            logger.error(f"Error enhancing image: {e}")
            return image_array

# Global face recognition service instance
face_service = FaceRecognitionService()
