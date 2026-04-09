from collections import defaultdict

def calcular_moda_estado_estetico(movimentacoes):
    # Moda ponderada pela quantidade movimentada
    soma_por_estado = defaultdict(int)
    for mov in movimentacoes:
        soma_por_estado[mov.id_estado_estetico] += mov.quantidade
    if not soma_por_estado:
        return None
    return max(soma_por_estado, key=soma_por_estado.get)