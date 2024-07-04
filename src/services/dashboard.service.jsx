import api from './api';
const basePath = '/Dashboard';

const DashboardService = {
    getByDoc,
    getPartner,
    getCompanyPartner,
    getTotals,
    getDuplicateEmail,
    getDuplicateCep,
    getDuplicatePhone
};

async function getByDoc(cnpj) {
  return api.get(`${basePath}/doc/${cnpj}`);
}

async function getPartner(cnpj) {
  return api.get(`${basePath}/partner/doc/${cnpj}`);
}

async function getCompanyPartner(cnpj) {
  return api.get(`${basePath}/company/doc/${cnpj}`);
}

async function getTotals(data) {
  return api.post(`${basePath}/company/duplicate-total`, data);
}

async function getDuplicateEmail(data) {
  return api.post(`${basePath}/company/duplicate-email`, data);
}

async function getDuplicateCep(data) {
  return api.post(`${basePath}/company/duplicate-zipcode`, data);
}

async function getDuplicatePhone(data) {
  return api.post(`${basePath}/company/duplicate-phone`, data);
}

export default DashboardService;
