from abc import ABC
from abc import abstractmethod


class BaseAIProvider(ABC):

    @abstractmethod
    def generate_script(
        self,
        prompt: str
    ):
        pass

    @abstractmethod
    def generate_plan(
        self,
        prompt: str
    ):
        pass
