import api from './api';
const basePath = '/Company';

const CompanyService = {
    getByDoc,
};

async function getByDoc(cnpj) {
  return api.get(`${basePath}/${cnpj}`);
}

export default CompanyService;
