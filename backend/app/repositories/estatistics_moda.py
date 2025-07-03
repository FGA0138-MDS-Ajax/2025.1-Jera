from app.db.models.movimentacao_estoque import MovimentacaoEstoque
from collections import Counter
# Counter: Conta quantos vezes um elemento aparece em uma lista

def calcular_moda_estado_estetico(movimentacoes: list[MovimentacaoEstoque]) -> int|None:

    estados = [m.id_estado_estetico for m in movimentacoes]
    if not estados:
        return None
    id_moda = Counter(estados).most_common(1)[0][0]
    return id_moda