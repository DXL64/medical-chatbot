from langchain_community.retrievers import WikipediaRetriever
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from source.utils.config_utils import get_config
import os

os.environ["OPENAI_API_KEY"] = get_config("openai", "api_key")

class WikiAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model=get_config("openai", "model_name"), base_url=get_config("openai", "base_url"))
        self.wiki_retriever = WikipediaRetriever(lang="vi", doc_content_chars_max=800, top_k_results=2)
    
    def invoke(self, inputs: str) -> str:
        sources = []
        found_docs = self.wiki_retriever.get_relevant_documents(inputs)
        sources.append(found_docs[0])
        sources.append(found_docs[1])

        context = " ".join(doc.page_content for doc in found_docs)
        context = " ".join(context.split()).replace("\n", "")
        prompt = (
            f"Bạn là một trợ lý y tế giúp hỗ trợ trả lời câu hỏi cho bệnh nhân. "
            f"Dựa vào thông tin sau: {context} Hãy trả lời đầy đủ bằng Tiếng Việt: {inputs}"
        )
        response = self.llm.invoke(prompt)
        return {
            "result": response.content,
            "source_documents": sources
        }