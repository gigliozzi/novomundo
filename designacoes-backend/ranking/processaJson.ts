import * as fs from 'fs';
import * as path from 'path';

// --- Interfaces para Tipagem ---
/**
 * @interface ItemJson
 * @description Define a estrutura de um único item no arquivo JSON de entrada.
 */
interface ItemJson {
    nome: string;
    data: string;
    parte: string;
    sala: string;
}

/**
 * @interface OcorrenciaDetalhada
 * @description Representa uma ocorrência específica de uma pessoa, com sua data e parte.
 */
interface OcorrenciaDetalhada {
    data: string;
    parte: string;
}

/**
 * @interface RankingEntry
 * @description Define a estrutura de uma entrada no ranking final.
 * Contém o nome, o número total de ocorrências e uma lista de detalhes de cada ocorrência.
 */
interface RankingEntry {
    nome: string;
    contagem: number;
    ocorrencias: OcorrenciaDetalhada[];
}

// --- Função Principal ---
/**
 * @function processarArquivoJson
 * @description Lê um arquivo JSON, processa os dados para criar um ranking
 * de pessoas baseado em suas ocorrências e gera um arquivo de saída.
 * @param {string} caminhoArquivoEntrada O caminho para o arquivo JSON de entrada.
 * @param {string} [caminhoArquivoSaida] Opcional. O caminho para o arquivo onde o ranking será salvo.
 * Se não for fornecido, o ranking será impresso no console.
 */
async function processarArquivoJson(caminhoArquivoEntrada: string, caminhoArquivoSaida?: string): Promise<void> {
    try {
        // --- Leitura do Arquivo ---
        console.log(`Lendo o arquivo: ${caminhoArquivoEntrada}`);
        const dadosRaw = await fs.promises.readFile(caminhoArquivoEntrada, 'utf8');
        const dados: ItemJson[] = JSON.parse(dadosRaw);
        console.log(`Arquivo lido com sucesso. Total de ${dados.length} registros.`);

        // --- Processamento dos Dados ---
        /**
         * @type {Map<string, { contagem: number; ocorrencias: OcorrenciaDetalhada[] }>}
         * @description Um mapa para armazenar os dados do ranking temporariamente.
         * A chave é o nome da pessoa e o valor contém a contagem e os detalhes das ocorrências.
         */
        const rankingMap = new Map<string, { contagem: number; ocorrencias: OcorrenciaDetalhada[] }>();

        dados.forEach(item => {
            const { nome, data, parte } = item;
            if (rankingMap.has(nome)) {
                const entry = rankingMap.get(nome)!; // O '!' garante que não é undefined
                entry.contagem++;
                entry.ocorrencias.push({ data, parte });
            } else {
                rankingMap.set(nome, {
                    contagem: 1,
                    ocorrencias: [{ data, parte }]
                });
            }
        });

        // --- Geração do Ranking Final ---
        /**
         * @type {RankingEntry[]}
         * @description Array final do ranking, ordenado pela contagem de ocorrências em ordem decrescente.
         */
        const rankingFinal: RankingEntry[] = Array.from(rankingMap.entries())
            .map(([nome, dadosOcorrencias]) => ({
                nome,
                contagem: dadosOcorrencias.contagem,
                ocorrencias: dadosOcorrencias.ocorrencias
            }))
            .sort((a, b) => b.contagem - a.contagem); // Ordena do maior para o menor

        // --- Formatação da Saída ---
        const linhasDeSaida: string[] = [];
        rankingFinal.forEach(entry => {
            linhasDeSaida.push(`Nome: ${entry.nome}`);
            linhasDeSaida.push(`Número de vezes que aparece no arquivo: ${entry.contagem}`);
            entry.ocorrencias.forEach(ocorrencia => {
                linhasDeSaida.push(`Data: ${ocorrencia.data}, ${ocorrencia.parte}`);
            });
            linhasDeSaida.push(''); // Linha em branco para separar as entradas
        });

        const conteudoSaida = linhasDeSaida.join('\n');

        // --- Escrita ou Impressão da Saída ---
        if (caminhoArquivoSaida) {
            await fs.promises.writeFile(caminhoArquivoSaida, conteudoSaida, 'utf8');
            console.log(`Ranking gerado e salvo em: ${caminhoArquivoSaida}`);
        } else {
            console.log('\n--- Ranking Final ---');
            console.log(conteudoSaida);
            console.log('--- Fim do Ranking ---');
        }

    } catch (error) {
        console.error('Ocorreu um erro ao processar o arquivo JSON:', error);
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

// --- Execução da Função ---
// Definir o caminho para o seu arquivo JSON de entrada
const arquivoEntrada = path.join(__dirname, 'dados.json');
// Opcional: Definir o caminho para o arquivo de saída. Se não for definido, o output será no console.
const arquivoSaida = path.join(__dirname, 'ranking.txt');

// Chama a função principal
processarArquivoJson(arquivoEntrada, arquivoSaida)
    .catch(error => {
        console.error('Erro na execução principal:', error);
    });