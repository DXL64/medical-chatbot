import ast
import re
from googletrans import Translator
import json

# Function to read the Diseases file and extract data
def read_disease_file(file_path):
    with open(file_path, 'r') as file:
        # Read the contents of the file
        disease_content = file.read()

    # Use regex to extract the diseases dictionary
    diseases_match = re.search(r'export const Diseases = (\{.*?\});', disease_content, re.DOTALL)

    if diseases_match:
        # Use ast.literal_eval to safely evaluate the Diseases dict from the JSX file
        diseases_dict = ast.literal_eval(diseases_match.group(1))  # Extracted dict from JSX
        return diseases_dict
    else:
        print("Diseases list not found in the JSX file.")
        return None

# Function to translate disease names from English to Vietnamese
def translate_disease_names(disease_names):
    translator = Translator()
    translated_diseases = {}

    # Translate each disease name from English to Vietnamese
    for disease in disease_names:
        try:
            translation = translator.translate(disease, src='en', dest='vi')
            translated_diseases[disease] = translation.text.capitalize()  # Capitalize the first letter
        except Exception as e:
            print(f"Error translating {disease}: {e}")
            translated_diseases[disease] = "Translation Error"
    
    return translated_diseases

# Function to translate the disease dictionary (only disease names)
def translate_diseases(diseases_dict):
    # Extract the disease names (keys of the dictionary)
    disease_names = list(diseases_dict.keys())

    # Translate the disease names
    translated_disease_names = translate_disease_names(disease_names)

    # Return a dictionary with the original disease names as keys and their translated names as values
    return translated_disease_names

# Function to save the translated dictionary to a file
def save_translations_to_file(translated_dict, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        # Write the dictionary to the file as JSON
        json.dump(translated_dict, file, ensure_ascii=False, indent=4)

# Example usage
if __name__ == "__main__":
    # File path of the JSX file with diseases
    disease_file_path = 'front-end/src/data/Diseases.jsx'  # Replace with your Disease.jsx file path

    # Read the disease data from the JSX file
    diseases = read_disease_file(disease_file_path)
    
    if diseases:
        # Translate the diseases (only disease names)
        translated_diseases = translate_diseases(diseases)
        
        # Save the translated diseases to a new file (output.json)
        output_file_path = 'translated_diseases.json'
        save_translations_to_file(translated_diseases, output_file_path)
        
        print(f"Translations saved to {output_file_path}")
    else:
        print("No diseases found to translate.")
