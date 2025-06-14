from app.db.models.alerta import Alerta
from app.db.models.tipo_alerta import TipoAlerta
from app.db.models.product import Product
from app.repositories.alerta import AlertaRepository
from app.services.tipo_alerta import TipoAlertaService

class AlertaService:
    """
    Camada de serviço responsável pela lógica de negócios relacionada a alertas.
    """

    @staticmethod
    def verificar_e_gerar_alerta(produto: Product, estoque_atual: int) -> list[Alerta]:
        alertas_gerados = []

        # IDs dos tipos de alerta (ajuste conforme seu banco)
        tipo_min = TipoAlertaService.get_tipo_alerta_by_id(1)  # Estoque abaixo do mínimo
        tipo_max = TipoAlertaService.get_tipo_alerta_by_id(2)  # Estoque acima do máximo
        tipo_prev_min = TipoAlertaService.get_tipo_alerta_by_id(3)  # Preventivo mínimo
        tipo_prev_max = TipoAlertaService.get_tipo_alerta_by_id(4)  # Preventivo máximo

        # Alerta preventivo: 10% acima do mínimo ou 10% abaixo do máximo
        margem = 0.1
        limite_prev_min = produto.estoque_minimo + int(produto.estoque_minimo * margem)
        limite_prev_max = produto.estoque_maximo - int(produto.estoque_maximo * margem) if produto.estoque_maximo else None
        
        
        if estoque_atual < produto.estoque_minimo:
            mensagem = f"Estoque abaixo do mínimo: {estoque_atual} < {produto.estoque_minimo}"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_min.id_tipo_alerta, mensagem)
            alertas_gerados.append(alerta)
        elif estoque_atual <= limite_prev_min:
            mensagem = f"Atenção: Estoque próximo do mínimo ({estoque_atual} <= {limite_prev_min})"
            alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_min.id_tipo_alerta, mensagem)
            alertas_gerados.append(alerta)

        if produto.estoque_maximo:
            if estoque_atual > produto.estoque_maximo:
                mensagem = f"Estoque acima do máximo: {estoque_atual} > {produto.estoque_maximo}"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_max.id_tipo_alerta, mensagem)
                alertas_gerados.append(alerta)
            elif estoque_atual >= limite_prev_max:
                mensagem = f"Atenção: Estoque próximo do máximo ({estoque_atual} >= {limite_prev_max})"
                alerta = AlertaRepository.gerar_alerta(produto.id_produto, tipo_prev_max.id_tipo_alerta, mensagem)
                alertas_gerados.append(alerta)

        return alertas_gerados

    @staticmethod
    def get_all_alerta() -> list[Alerta]:
        return AlertaRepository.get_all_alerta()
    
    @staticmethod
    def get_alerta_by_id(id_alerta: int) -> Alerta | None:
        """
        Busca um alerta pelo seu ID.

        Args:
            id_alerta (int): ID do alerta.

        Returns:
            Alerta | None: O alerta encontrado ou None se não existir.
        """
        return AlertaRepository.get_alerta_by_id(id_alerta)

    @staticmethod
    def get_alertas_by_produto(id_produto: int) -> list[Alerta]:
        """
        Busca todos os alertas de um produto.

        Args:
            id_produto (int): ID do produto.

        Returns:
            list[Alerta]: Lista de alertas do produto.
        """
        return AlertaRepository.get_alerta_by_product(id_produto)

    @staticmethod
    def delete_alerta(id_alerta: int) -> None:
        """
        Remove um alerta pelo seu ID.

        Args:
            id_alerta (int): ID do alerta a ser removido.

        Returns:
            None
        """
        return AlertaRepository.delete_alerta(id_alerta)