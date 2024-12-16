from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableConfig
from langchain_core.runnables import Runnable
from langgraph.graph import END, StateGraph
from langgraph.graph.graph import CompiledGraph
from typing import Annotated, Dict, Optional, Tuple, TypedDict
from langchain_core.messages import HumanMessage
from IPython.display import Image
import os
import pandas as pd
from source.utils.config_utils import get_config
from source.medical_runnable import ExtractDiseaseRunnable, GeneralAnswer, MedicalAnswer, SearchDisease, extract_disease_condition, initialisation

os.environ["OPENAI_API_KEY"] = get_config("openai", "api_key")

class MedicalState(TypedDict):
    user_input: str
    name_of_disease: list[str]
    columns: list[str]
    context: str
    output: str

class MedicalGraph:
    def __init__(self):
        self.llm = ChatOpenAI(model=get_config("openai", "model_name"), base_url=get_config("openai", "base_url"))
        self.data_path = get_config("data", "path")
        self.dataframe = pd.read_csv(self.data_path)
        self.all_diseases = self.dataframe["name"].tolist()
        self.graph = StateGraph(MedicalState)
        self.compiled_graph = self._compile_graph()

    def _compile_graph(self) -> CompiledGraph:
        self.graph.add_node(
            "extract_disease", ExtractDiseaseRunnable(self.llm).invoke
        )
        self.graph.set_entry_point("extract_disease")
        self.graph.add_node(
            "search_disease", SearchDisease(path=self.data_path).invoke
        )
        self.graph.add_node(
            "general_answer", GeneralAnswer(self.llm).invoke
        )
        self.graph.add_conditional_edges(
            "extract_disease",
            extract_disease_condition,
            {
                "general_answer": "general_answer",
                "search_disease": "search_disease",
            },
        )
        self.graph.add_edge("general_answer", END)
        self.graph.add_node(
            "medical_answer", MedicalAnswer(self.llm).invoke
        )
        self.graph.add_edge(
            "search_disease", "medical_answer"
        )
        self.graph.add_edge("medical_answer", END)
        return self.graph.compile()

    def visualize_graph(self, visualization_type: str = "ascii") -> Optional[str]:
        if visualization_type == "ascii":
            self.compiled_graph.get_graph().print_ascii()
        if visualization_type == "image":
            image = Image(self.compiled_graph.get_graph().draw_png())
            return image

    def invoke(self, inputs: dict) -> dict:
        return self.compiled_graph.invoke(inputs)

if __name__ == "__main__":
    demo = MedicalGraph()
    demo.visualize_graph()
    print(demo.llm)
    result = demo.invoke(
        {
            "user_input": "Cho tôi biết bệnh áp xe và bệnh hay ngủ",
            "columns": demo.dataframe.columns.to_list(),
        }
    )
    print(result["output"])