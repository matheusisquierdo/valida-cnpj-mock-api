export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Use GET.' });
  }

  const { cnpj } = req.query;

  if (!cnpj) {
    return res.status(400).json({
      error: 'CNPJ não informado.',
      exemplo: '/api/validate?cnpj=11222333000181'
    });
  }

  const cnpjLimpo = cnpj.replace(/[.\-\/]/g, '');

  if (!/^\d{14}$/.test(cnpjLimpo)) {
    return res.status(400).json({
      cnpj: cnpj,
      status: 'INVALIDO',
      situacao_cadastral: null,
      mensagem: 'CNPJ inválido: deve conter 14 dígitos numéricos.'
    });
  }

  if (!validarDigitosCNPJ(cnpjLimpo)) {
    return res.status(422).json({
      cnpj: formatarCNPJ(cnpjLimpo),
      status: 'INVALIDO',
      situacao_cadastral: null,
      mensagem: 'CNPJ inválido: dígitos verificadores incorretos.'
    });
  }

  const ultimoDigito = parseInt(cnpjLimpo[13]);
  const penultimoDigito = parseInt(cnpjLimpo[12]);

  const isImpar = ultimoDigito % 2 !== 0;
  const terminaComDois = penultimoDigito === 2 && ultimoDigito === 2;

  if (terminaComDois) {
    return res.status(200).json({
      cnpj: formatarCNPJ(cnpjLimpo),
      status: 'ATIVO',
      situacao_cadastral: 'ATIVA',
      data_situacao: '2020-01-15',
      razao_social: 'EMPRESA MOCK ATIVA LTDA',
      uf: 'SP',
      municipio: 'SÃO PAULO',
      mensagem: 'CNPJ com situação ativa na Receita Federal.'
    });
  }

  if (isImpar) {
    return res.status(200).json({
      cnpj: formatarCNPJ(cnpjLimpo),
      status: 'INATIVO',
      situacao_cadastral: 'INAPTA',
      data_situacao: '2023-06-01',
      razao_social: 'EMPRESA MOCK INAPTA LTDA',
      uf: 'RJ',
      municipio: 'RIO DE JANEIRO',
      mensagem: 'CNPJ com situação inativa/inapta na Receita Federal.'
    });
  }

  return res.status(200).json({
    cnpj: formatarCNPJ(cnpjLimpo),
    status: 'ATIVO',
    situacao_cadastral: 'ATIVA',
    data_situacao: '2019-03-22',
    razao_social: 'EMPRESA MOCK REGULAR LTDA',
    uf: 'MG',
    municipio: 'BELO HORIZONTE',
    mensagem: 'CNPJ com situação ativa na Receita Federal.'
  });
}

function validarDigitosCNPJ(cnpj) {
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (cnpj, len) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(cnpj.charAt(len - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };

  const d1 = calc(cnpj, 12);
  if (d1 !== parseInt(cnpj[12])) return false;

  const d2 = calc(cnpj, 13);
  if (d2 !== parseInt(cnpj[13])) return false;

  return true;
}

function formatarCNPJ(cnpj) {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
