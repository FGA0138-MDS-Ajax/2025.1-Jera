import importlib
import inspect
from pathlib import Path

from app.db.manager import DBManager
from app.utils.logger import Logger

logger = Logger("app.db.models")

def import_all_models():
    """
    Importa dinamicamente todas as classes dos arquivos .py neste diretório que herdam de DBManager.BaseModel.
    Adiciona essas classes ao globals() e __all__.
    """
    models_dir: Path = Path(__file__).parent
    _imported_classes = {}

    # Itera por todos os arquivos .py no diretório de modelos
    for file_path in models_dir.glob("*.py"):
        # Ignora __init__.py e quaisquer arquivos que começam com underscore
        if file_path.name.startswith("__") or file_path.name.startswith("_"):
            continue

        # Obtém o nome do módulo sem a extensão .py
        module_name = file_path.stem

        try:
            # Importa o módulo dinamicamente
            module = importlib.import_module(f".{module_name}", package=__name__)

            # Obtém todas as classes do módulo que herdam de DBManager.BaseModel
            for name, obj in inspect.getmembers(module, inspect.isclass):
                if (
                    obj.__module__ == module.__name__
                    and issubclass(obj, DBManager.BaseModel)
                    and obj is not DBManager.BaseModel
                ):
                    globals()[name] = obj
                    _imported_classes[name] = obj

        except ImportError as e:
            logger.warning(f"Não foi possível importar o módulo {module_name}: {e}")
            continue

    return _imported_classes
