from source.medical_graph import MedicalGraph

class MedicalAgent:
    def __init__(self):
        self.medical_graph = MedicalGraph()

    def invoke(self, inputs: dict) -> str:
        inputs["columns"] = self.medical_graph.dataframe.columns.to_list()
        return {
            "result": self.medical_graph.invoke(inputs)["output"],
            "source_documents": self.medical_graph.invoke(inputs)["context"]
        }

if __name__ == "__main__":
    agent = MedicalAgent()
    print(agent.invoke({"user_input": "cho tôi biết về bệnh áp xe và bệnh thiếu tiền"}).keys())