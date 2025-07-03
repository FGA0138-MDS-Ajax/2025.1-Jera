from app.repositories.lote import LoteRepository
from app.db.models.lote import Lote

class LoteService:

    @staticmethod
    def criar_lote(lote: Lote) -> Lote:
        return LoteRepository.criar_lote(lote)

    @staticmethod
    def listar_lotes():
        return LoteRepository.listar_lotes()
    
    @staticmethod
    def listar_lotes_por_id(id_lote:int) -> Lote | None:
        return LoteRepository.get_lote_by_id(id_lote)

    @staticmethod
    def atualizar_lote(id_lote: int, dados: dict) -> Lote | None:
        return LoteRepository.atualizar_lote(id_lote, dados)

    @staticmethod
    def deletar_lote(id_lote: int) -> bool:
        return LoteRepository.deletar_lote(id_lote)

    