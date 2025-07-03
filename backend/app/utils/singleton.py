#ruff: noqa: SLF001

from functools import wraps


def singleton(cls):
    cls._sn_cls = None
    cls._sn_is_init = False

    orig_new = cls.__new__
    orig_init = cls.__init__

    @staticmethod
    @wraps(orig_new)
    def singleton_new(cls_, *args, **kwargs):
        if cls_._sn_cls is None:
            if orig_new is object.__new__:
                instance = object.__new__(cls_)
            else:
                instance = orig_new(cls_, *args, **kwargs)
            cls_._sn_cls = instance
        return cls_._sn_cls

    @wraps(orig_init)
    def singleton_init(self, *args, **kwargs):
        if self._sn_is_init:
            return
        orig_init(self, *args, **kwargs)
        self._sn_is_init = True

    cls.__new__ = singleton_new
    cls.__init__ = singleton_init
    return cls
