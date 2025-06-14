from app.db.models.alerta import Alerta
from app.db.models.product import Product
from app.repositories.alerta import AlertaRepository

class AlertaService:

    """
    Camada de serviço responsável pela lógica de negócios relacionada a alertas.
    """

    @staticmethod
    def verificar_e_gerar_alerta(produto: Product, estoque_atual: int) -> list[Alerta]:
        return AlertaRepository.verificar_e_gerar_alerta(produto, estoque_atual)

    @staticmethod
    def get_all_alerta() -> list[Alerta]:
        return AlertaRepository.get_all_alerta()
    
    @staticmethod
    def get_alerta_by_id(id_alerta: int) -> Alerta | None:
        return AlertaRepository.get_alerta_by_id(id_alerta)

    @staticmethod
    def get_alertas_by_produto(id_produto: int) -> list[Alerta]:
        return AlertaRepository.get_alerta_by_product(id_produto)

    @staticmethod
    def delete_alerta(id_alerta: int) -> None:
        return AlertaRepository.delete_alerta(id_alerta)

    @staticmethod
    def delete_all_alerta() -> None:
        return AlertaRepository.delete_all_alerta()