import ast
from googletrans import Translator

# Function to read the JSX file and extract the Symptoms list
def read_jsx_file(file_path):
    with open(file_path, 'r') as file:
        # Read the contents of the JSX file
        jsx_content = file.read()

    # Use ast.literal_eval to safely evaluate the Symptoms array from the JSX file
    # This will safely parse the Symptoms list into a Python list
    symptoms_list = None
    try:
        # Extract Symptoms array from JSX
        start = jsx_content.find('[')
        end = jsx_content.find(']')
        symptoms_list = ast.literal_eval(jsx_content[start:end+1])
    except Exception as e:
        print(f"Error parsing JSX file: {e}")
    
    return symptoms_list

# Function to translate symptoms from English to Vietnamese
def translate_symptoms(symptoms):
    # Initialize the Google Translate client
    translator = Translator()
    translated_dict = {}
    
    # Loop through each symptom and translate it
    for symptom in symptoms:
        try:
            # Translate each symptom to Vietnamese
            print(symptom)
            translation = translator.translate(symptom, src='en', dest='vi')
            print(translation.text)
            translated_dict[symptom] = translation.text.capitalize()
        except Exception as e:
            print(f"Error translating {symptom}: {e}")
            translated_dict[symptom] = "Translation Error"
    
    return translated_dict

# Function to save the translated dictionary to a file
def save_translations_to_file(translated_dict, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        # Write the dictionary to the file as JSON
        import json
        json.dump(translated_dict, file, ensure_ascii=False, indent=4)

# Example usage
if __name__ == "__main__":
    # File path of the JSX file with symptoms
    jsx_file_path = 'front-end/src/data/Symptoms.jsx'  # Replace with your JSX file path
    
    # Read the symptoms from the JSX file
    symptoms = read_jsx_file(jsx_file_path)
    
    if symptoms:
        # Translate the symptoms
        translated_symptoms = translate_symptoms(symptoms)
        
        # Save the translated symptoms to a new file (output.json)
        output_file_path = 'translated_symptoms.json'
        save_translations_to_file(translated_symptoms, output_file_path)
        
        print(f"Translations saved to {output_file_path}")
    else:
        print("No symptoms found to translate.")
