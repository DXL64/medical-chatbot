from langchain_core.runnables import Runnable
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_openai import ChatOpenAI
import os
from pydantic import BaseModel, Field
import pandas as pd

from source.utils.config_utils import get_config
from source.utils.log_utils import get_logger

logger = get_logger(__file__)

os.environ["OPENAI_API_KEY"] = get_config("openai", "api_key")
def initialisation(inputs: dict) -> dict:
    logger.info("initialisation")
    return {
        "name_of_disease": [],
        "context": "",
        "output": "",
        "user_input": inputs["user_input"],
        "columns": inputs["columns"]
    }

class ExtractDisease(BaseModel):
    name_of_disease: list[str] = Field(description="name of disease")
    columns: list[str] = Field(description="columns which are the most relevant to the user's question")

class ExtractDiseaseRunnable(Runnable):
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm.with_structured_output(ExtractDisease)

    def generate_prompt(self, state: dict):
        prompt = ChatPromptTemplate.from_messages([
            ("human", "You have a medical dataframe with columns: `{columns}` and user's question: `{user_input}`. Your task is to find out all name of diseases user has mentioned and which columns should I use to answer the question."),
        ])
        return prompt.format_messages(user_input=state["user_input"], columns=state["columns"])

    def invoke(self, state: dict, **kwargs):
        logger.info("extract disease")
        prompt = self.generate_prompt(state)
        response = self.llm.invoke(prompt)
        return {
            "name_of_disease": response.name_of_disease,
            "columns": response.columns
        }

class SearchDisease(Runnable):
    def __init__(self, path: str):
        self.path = path
        self.dataframe = pd.read_csv(self.path)
        self.all_diseases = self.dataframe["name"].tolist()
        self.name2index = {item.lower(): self.all_diseases.index(item) for item in self.all_diseases}

    def search_disease_in_database(self, disease_extract_list: list, disease_db_list: list):
        extract_list = [item.lower() for item in disease_extract_list]
        db_list = [item.lower() for item in disease_db_list]
        set_db = set(db_list)
        # logger.info(set_db)
        in_elements = [item for item in extract_list if item in set_db]
        out_elements = [item for item in disease_extract_list if item not in set_db]
        return in_elements, out_elements
    
    def invoke(self, state: dict, **kwargs):
        logger.info("search disease")
        disease_list = state["name_of_disease"]
        columns = state["columns"]
        in_diseases, out_diseases = self.search_disease_in_database(disease_list, self.all_diseases)
        # logger.info((in_diseases, out_diseases))

        context = ""
        for disease in in_diseases:
            context += f"{disease}\n"
            for column in columns:
                context += f"{column}: {self.dataframe.iloc[self.name2index[disease]][column]}\n"
        context += f"Đây là những bệnh không có trong cơ sở tri thức của chúng tôi.\n {', '.join(out_diseases)}"
        return {
            "context": context
        }

class GeneralAnswer(Runnable):
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def generate_prompt(self, state: dict):
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a medical chatbot. Your task is to answer the user's question about the diseases that user has mentioned. If user does not ask about diseases, tell the user to ask about your role."),
            ("human", state["user_input"])
        ])
        return prompt.format_messages()

    def invoke(self, state: dict, **kwargs):
        logger.info("general answer")
        prompt = self.generate_prompt(state)
        response = self.llm.invoke(prompt)
        return {
            "output": response.content
        }

class MedicalAnswer(Runnable):
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def generate_prompt(self, state: dict):
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a medical chatbot. Your task is to answer the user's question about the diseases that user has mentioned. Only the provided information."),
            ("human", f"These are provided information: {state['context']}, user's question: {state['user_input']}")
        ])
        return prompt.format_messages()

    def invoke(self, state: dict, **kwargs):
        logger.info("medical answer")
        prompt = self.generate_prompt(state)
        response = self.llm.invoke(prompt)
        return {
            "output": response.content
        }

def extract_disease_condition(state: dict):
    if not len(state["name_of_disease"]) or not len(state["columns"]):
        return "general_answer"
    return "search_disease"

if __name__ == "__main__":
    pass