from app.db.models.tipo_alerta import TipoAlerta
from app.repositories.tipo_alerta import TipoAlertaRepository

class TipoAlertaService:
    """
    Camada de serviço responsável pela lógica de negócios relacionada a TipoAlerta.
    """

    @staticmethod
    def create_tipo_alerta(tipo_alerta_data: TipoAlerta) -> TipoAlerta:
        """
        Cria um novo tipo de alerta.

        Args:
            tipo_alerta_data (TipoAlerta): Instância do modelo TipoAlerta a ser criada.

        Returns:
            TipoAlerta: Tipo de alerta criado.
        """
        return TipoAlertaRepository.create_tipo_alerta(tipo_alerta_data)

    @staticmethod
    def get_tipo_alerta_by_id(id_tipo_alerta: int) -> TipoAlerta | None:
        """
        Busca um tipo de alerta pelo seu ID.

        Args:
            id_tipo_alerta (int): ID do tipo de alerta.

        Returns:
            TipoAlerta | None: Tipo de alerta encontrado ou None se não existir.
        """
        return TipoAlertaRepository.get_tipo_alerta_by_id(id_tipo_alerta)

    @staticmethod
    def get_all_tipo_alertas() -> list[TipoAlerta]:
        """
        Recupera todos os tipos de alerta cadastrados.

        Returns:
            list[TipoAlerta]: Lista de todos os tipos de alerta.
        """
        return TipoAlertaRepository.get_all_tipo_alertas()

    @staticmethod
    def update_tipo_alerta(tipo_alerta_data: TipoAlerta) -> TipoAlerta | None:
        """
        Atualiza um tipo de alerta existente.

        Args:
            tipo_alerta_data (TipoAlerta): Instância do modelo TipoAlerta com os dados atualizados.

        Returns:
            TipoAlerta | None: Tipo de alerta atualizado ou None se não encontrado.
        """
        return TipoAlertaRepository.update_tipo_alerta(tipo_alerta_data)

    @staticmethod
    def delete_tipo_alerta(id_tipo_alerta: int) -> None:
        """
        Remove um tipo de alerta pelo seu ID.

        Args:
            id_tipo_alerta (int): ID do tipo de alerta a ser removido.

        Returns:
            None
        """
        TipoAlertaRepository.delete_tipo_alerta(id_tipo_alerta)