import datetime as dt
import logging
import sys
from logging import Formatter, StreamHandler
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.config.settings import Settings

config = Settings()


def setup_logging() -> None:
    logging.root.setLevel(logging.NOTSET)
    if config.DISABLE_EXISTING_LOGGERS:
        for logger in logging.Logger.manager.loggerDict.values():
            logger.disabled = True
    logging.setLoggerClass(LoggerSettings)


class LoggerSettings(logging.Logger):
    _current_date = dt.datetime.now(tz=dt.UTC).date()

    def __init__(self, name: str) -> None:
        super().__init__(name)

        today = dt.datetime.now(tz=dt.UTC).date()

        if not self.handlers:
            default_formatter = Formatter(
                fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%S%z",
            )

            stdout_handler = StreamHandler(stream=sys.stdout)
            stdout_handler.setLevel(logging.DEBUG if config.DEBUG else logging.INFO)
            stdout_handler.setFormatter(default_formatter)

            log_path = Path(config.LOG_DIR)
            log_path.mkdir(parents=True, exist_ok=True)
            log_file = log_path / f"{today.strftime('%Y-%m-%d')}_{config.LOG_FILE}"

            file_handler = RotatingFileHandler(
                filename=log_file,
                maxBytes=config.LOG_MAX_BYTES,  # 10 MB
                backupCount=config.LOG_BACKUP_COUNT,
                encoding="utf-8",
                mode="a",
            )
            file_handler.setLevel(logging.DEBUG if config.DEBUG else logging.INFO)
            file_handler.setFormatter(default_formatter)

            self.addHandler(stdout_handler)
            self.addHandler(file_handler)
        elif today > LoggerSettings._current_date:
            LoggerSettings._current_date = today
            for handler in self.handlers:
                if isinstance(handler, RotatingFileHandler):
                    handler.baseFilename = (
                        Path(config.LOG_DIR)
                        / f"{today.strftime('%Y-%m-%d')}_{config.LOG_FILE}"
                    )
                    handler.doRollover()
