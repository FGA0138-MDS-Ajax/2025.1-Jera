import inspect
from collections import OrderedDict
from collections.abc import Callable
from functools import wraps

from sqlalchemy.orm import Session

from app.db.manager import DBManager
from app.utils.logger import Logger

logger = Logger()

def with_session(func: Callable):
    params: OrderedDict[str, inspect.Parameter] = inspect.signature(func).parameters.copy()
    if not params:
        msg = "Funções decoradas com @with_session devem ter pelo menos um parâmetro."
        raise ValueError(msg)

    last_param_name = next(reversed(params.keys()))
    if last_param_name != "session":
        msg = "O último parâmetro da função decorada com @with_session deve ser 'session'."
        raise ValueError(msg)

    last_param = params.get(last_param_name)
    if isinstance(last_param.default, inspect._empty) or (not isinstance(last_param.default, inspect._empty) and last_param.default is not None):  # noqa: SLF001
        msg = "O parâmetro 'session' deve ter um valor padrão de None para que seja possível omitir esse valor ao usar a função."
        raise ValueError(msg)

    @wraps(func)
    def wrapper(*args, **kwargs):
        # Session passado como arg
        if len(args) == len(params):
            if isinstance(args[-1], Session):
                return func(*args)
            msg = "O último argumento deve ser uma instância de Session ou None."
            raise ValueError(
                msg
            )

        # Session passado como kwarg
        if "session" in kwargs:
            if isinstance(kwargs["session"], Session):
                return func(*args, **kwargs)
            msg = "O argumento 'session' deve ser uma instância de Session ou None."
            raise ValueError(
                msg
            )

        # Session não foi passado
        def inner_session(*args, **kwargs):
            with DBManager.get_session_context() as session:
                kwargs["session"] = session
                f = func(*args, **kwargs)
            del session
            return f

        return inner_session(*args, **kwargs)

    return wrapper
