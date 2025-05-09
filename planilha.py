import pandas as pd # type: ignore

# Estrutura dos dados do formulário como exemplo
dados_exemplo = {
    "Descrição do Produto": ["Produto A"],
    "Quant.Venda": [10],
    "Preço de Custo (R$)": [50.00],
    "Porcentagem (%)": [20],
    "Tarifa de Venda (R$)": [5.00],
    "Frete (R$)": [10.00],
    "Custo de Gestão de Venda (R$)": [3.00],
    "Preço de Venda (R$)": [80.00],
    "Lucro (R$)": [12.00]
}

df_relatório = pd.DataFrame(dados_exemplo)
import ace_tools as tools; tools.display_dataframe_to_user(name="Relatório de Vendas", dataframe=df_relatorio) # type: ignore
