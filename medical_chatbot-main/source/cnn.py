import torch.nn as nn
import torch
import cv2
import numpy as np

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

class CustomCNN(nn.Module):
    def __init__(self):
        super(CustomCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)  # 1 input channel for grayscale
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.fc1 = nn.Linear(256 * 56 * 56, 128)  
        self.fc2 = nn.Linear(128, 2)  

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.relu(self.conv2(x))
        x = torch.max_pool2d(x, 2)  # Pooling layer
        x = torch.relu(self.conv3(x))
        x = torch.relu(self.conv4(x))
        x = torch.max_pool2d(x, 2)  
        x = x.view(x.size(0), -1)  
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x
    
# Preprocessing function for image classification (no PIL, using OpenCV)
def preprocess_image_resnet(image_bytes: bytes):
    # Convert bytes to image using OpenCV
    np_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    # Convert to grayscale if the image is in color
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Convert grayscale to RGB by repeating the single channel 3 times
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

    # Resize image to 224x224
    image = cv2.resize(image, (224, 224))

    # Normalize the image (same normalization as used by torchvision models)
    image = image.astype(np.float32) / 255.0
    image = (image - 0.485) / 0.229  # Normalize to the same range as ImageNet

    # Convert to tensor
    # image_tensor = torch.tensor(image).permute(2, 0, 1)  # Change to CxHxW format
    image_tensor = image_tensor.unsqueeze(0)  # Add batch dimension
    image_tensor = image_tensor.to(device)
    
    return image_tensor

def preprocess_image_cnn(image_bytes: bytes):
    # Load an image using OpenCV
    np_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    # Convert to grayscale if the image is in color
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize image to 224x224
    image = cv2.resize(image, (224, 224))

    # # Normalize the image (same normalization as used by torchvision models)
    image = image.astype(np.float32) / 255.0
    image = (image - 0.485) / 0.229  # Normalize to the same range as ImageNet

    # Convert to tensor
    image_tensor = torch.tensor(image)  # Change to CxHxW format
    image_tensor = image_tensor.unsqueeze(0) # Add channel dimension
    image_tensor = image_tensor.unsqueeze(0) # Add batch dimension

    return image_tensor