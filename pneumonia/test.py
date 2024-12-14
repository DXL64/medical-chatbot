import torch
import cv2
import numpy as np
from torchvision import models, transforms
import torch.nn as nn 

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

# Check for CUDA (GPU) availability
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# # Load the trained model (resnet.pth) with map_location for CPU-only machines
# model = models.resnet18(pretrained=True)
# model.fc = torch.nn.Linear(model.fc.in_features, 2)  # Adjust for binary classification

# # Load the model weights, specify map_location to handle CPU-only systems
# model.load_state_dict(torch.load('../models/resnet18.pth', map_location=device))  # Ensure model loads correctly for CPU
# model.to(device)  # Move the model to the selected device (GPU or CPU)
# model.eval()  # Set model to evaluation mode

model = CustomCNN()
model.load_state_dict(torch.load('../models/cnn.pth', map_location=device))
model.to(device)
model.eval()

# Preprocessing pipeline (same as the one you used for training)
def preprocess_image(image_path):
    # Load an image using OpenCV
    image = cv2.imread(image_path)

    # Convert to grayscale if the image is in color
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Convert grayscale to RGB by repeating the single channel 3 times
    # image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

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

# Load and preprocess the image
image_path = 'viemphoi.png'  # Replace with your image path
image_tensor = preprocess_image(image_path)

# Move the image tensor to the same device as the model
image_tensor = image_tensor.to(device)

# Perform inference
with torch.no_grad():  # No need to calculate gradients during inference
    outputs = model(image_tensor)
    print(outputs)
    _, predicted = torch.max(outputs, 1)  # Get the predicted class label

# Print the result
print(f"Predicted Class: {predicted}")
