import inspect
import logging
from typing import Self


class Logger:
    def __new__(cls, name: str | None = None) -> Self:
        if name is None:
            frame = inspect.stack()[1]
            module = inspect.getmodule(frame[0])
            name = "unknown_module" if module is None else module.__name__

        return logging.getLogger(name)
