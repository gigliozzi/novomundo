export function formatarIntervaloSemana(data: string | Date): string {
  const baseDate = typeof data === "string" ? new Date(data) : data;

  // Pega o dia da semana (0 = domingo, 1 = segunda, ..., 6 = sábado)
  const diaSemana = baseDate.getDay();

  // Calcula o quanto precisamos "voltar" para chegar na segunda
  const segunda = new Date(baseDate);
  const offset = diaSemana === 0 ? -6 : 1 - diaSemana; // domingo volta 6, outros: segunda é 1
  segunda.setDate(baseDate.getDate() + offset);

  // Sábado = segunda + 6
  const sabado = new Date(segunda);
  sabado.setDate(segunda.getDate() + 6);

  const diaInicio = segunda.getDate();
  const diaFim = sabado.getDate();

  const mesInicio = segunda.toLocaleDateString("pt-BR", { month: "long" });
  const mesFim = sabado.toLocaleDateString("pt-BR", { month: "long" });

  const intervalo = mesInicio === mesFim
    ? `${diaInicio}–${diaFim} de ${mesInicio}`
    : `${diaInicio} de ${mesInicio} – ${diaFim} de ${mesFim}`;

    return intervalo.toLocaleUpperCase();
}
