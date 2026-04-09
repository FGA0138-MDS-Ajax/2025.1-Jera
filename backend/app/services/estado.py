from app.repositories.estado_estetico import EstadoEsteticoRepository
from app.db.models.estado_estetico import EstadoEstetico

class EstadoEsteticoService:

    @staticmethod
    def criar_estado(nome_estado: str) -> EstadoEstetico:
        return EstadoEsteticoRepository.criar_estado(nome_estado)

    @staticmethod
    def listar_estados() -> list[EstadoEstetico]:
        return EstadoEsteticoRepository.listar_estados()

    @staticmethod
    def get_estado_by_id(id_estado: int) -> EstadoEstetico | None:
        return EstadoEsteticoRepository.get_estado_by_id(id_estado)
    
    @staticmethod
    def deletar_estado_by_id(id_estado:int) -> None:
        return EstadoEsteticoRepository.deletar_estado(id_estado)
    
    @staticmethod
    def update_estado_estetico(id_estado_estetico: int, data) -> EstadoEstetico | None:
        return EstadoEsteticoRepository.update_estado_estetico(id_estado_estetico, data)