import React, { useState } from 'react';
import { CNPJ_MASK } from '../../utils/constants'
import './style.css'
import Functions from '../../utils/functions'
import CompanyService from '../../services/company.service';
import Loader from '../../components/loader'
import SideBar from '../../components/sidebar'
import TopBar from '../../components/topbar'
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { FaSearch } from "react-icons/fa";

function Home() {
  const [cnpj, setCnpj] = useState('');
  const [invalidCnpj, setInvalidCnpj] = useState(false)
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState(null)
  const [partners, setPartners] = useState([])
  const [institute, setInstitute] = useState(null)
  const [companyPartners, setCompanyPartners] = useState([])
  const [companyDuplicatePhone, setCompanyDuplicatePhone] = useState([])
  const [companyDuplicateZip, setCompnayDuplicateZip] = useState([])
  const [companyDuplicateEmail, setCompanyDuplicateEmail] = useState([])

  const handlePesquisarCnpj = async () => {
    setLoading(true)
    setCompany(null)
    setInstitute(null)
    setPartners([])
    setCompanyPartners([])
    setCompanyDuplicateEmail([])
    setCompanyDuplicatePhone([])
    setCompnayDuplicateZip([])
    if(Functions.validarCnpj(cnpj)) {
      try {
        const cnpjNumbers = cnpj.replace(/\D/g,'');
        const response = await CompanyService.getByDoc(cnpjNumbers)
        if(response.data) {
          setCompany(response.data.company)
          setInstitute(response.data.institute)
          setPartners(response.data.partners)
          setCompanyPartners(response.data.companiesPartner)
          setCompanyDuplicateEmail(response.data.companiesDuplicateEmail)
          setCompanyDuplicatePhone(response.data.companiesDuplicatePhone)
          setCompnayDuplicateZip(response.data.companiesDuplicateZipCode)
        } else {

        }
      } catch {}
      finally {
        setLoading(false)
      }
    } else {
      setInvalidCnpj(true)
      setLoading(false)
    }
  }

  return (
    <div class="main-body-container">
      <SideBar />
      <div class="container-main">
        <TopBar />
        <div class="container-home">
          <div class="header">
            <div class="header-conteudo">
              Informe o CNPJ da empresa que deseja pesquisar
            </div>
            <div class="search-container">
              <button disabled={loading} class="btn-search" onClick={handlePesquisarCnpj}><FaSearch color='#5f5f5f' /></button>
              <MaskedFormControl
                type="text"
                id="cnpj"
                className="input-search"
                name="cnpj"
                mask={CNPJ_MASK}
                placeholder="Informe o CNPJ"
                disabled={loading}
                onChange={(e) => {
                  setInvalidCnpj(false)
                  setCnpj(e.target.value)
                }}
                value={cnpj}
              />
            </div>
            {invalidCnpj && (
              <span class="error-validate">* CNPJ inválido</span>
            )}
          </div>
          <div class="conteudo">
            {loading ? (
              <div class="loader-container">
                <Loader />
              </div>
            ) : (
              <>
                {(company !== null && institute !== null) && (
                  <div class="company-container">
                    <div class="company-header">
                      Dados da Empresa
                    </div>
                    <div class="company-body">
                      <div class="company-row">
                        <div class="company-item" style={{ width: '50%' }}>
                          <span class="company-title">Nome Fantasia </span>
                          <span class="company-text">{company.name}</span>
                        </div>
                        <div class="company-item" style={{ width: '50%' }}>
                          <span class="company-title">Nome Legal </span>
                          <span class="company-text">{institute.name}</span>
                        </div>
                      </div>
                      <div class="company-row">
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Categoria </span>
                          <span class="company-text">{institute.companyCategoryName}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Email </span>
                          <span class="company-text">{institute.email}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Telefone </span>
                          <span class="company-text">{Functions.formatPhone(institute.phoneDDD, institute.phoneNumber)}</span>
                        </div>
                      </div>
                      <div class="company-row">
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">CNPJ </span>
                          <span class="company-text">{Functions.formatCnpj(institute.instituteDoc)}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Natureza Legal </span>
                          <span class="company-text">{company.legalNatureName}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Qualificação </span>
                          <span class="company-text">{company.qualificationName}</span>
                        </div>
                      </div>
                      <div class="company-row">
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Renda </span>
                          <span class="company-text">{Functions.formatNumberToCurrency(company.shareCapitalValue)}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Tamanho </span>
                          <span class="company-text">{company.companySizeName}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Status </span>
                          <span class="company-text">{institute.statusName}</span>
                        </div>
                      </div>
                      <div class="company-row" style={{ marginBottom: 25 }}>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Data de Registro </span>
                          <span class="company-text">{Functions.formatNumberToData(institute.dateActivity)}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Tipo </span>
                          <span class="company-text">{institute.typeName}</span>
                        </div>
                      </div>
                      <div class="company-section-title">
                        <div class="company-section-text">
                          Endereço
                        </div>
                        <div className='line'></div>
                      </div>
                      <div class="company-row">
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">CEP </span>
                          <span class="company-text">{Functions.formatCep(institute.addressZipCode)}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Cidade/Estado </span>
                          <span class="company-text">{institute.cityName}/{institute.addressState}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Bairro </span>
                          <span class="company-text">{institute.addressNeighborhood}</span>
                        </div>
                      </div>
                      <div class="company-row">
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Endereço </span>
                          <span class="company-text">{institute.addressTypeId} {institute.addressLocalization}</span>
                        </div>
                        <div class="company-item" style={{ width: '33%' }}>
                          <span class="company-title">Complemento </span>
                          <span class="company-text">{institute.addressComplement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {companyPartners && (
                  <div class="company-container">
                    <div class="company-header">
                      Empresas Sócios
                    </div>
                    <div class="company-table-body">
                      <table class="table-company">
                        <thead>
                          <th>ID</th>
                          <th>Tipo</th>
                          <th>Nome</th>
                          <th>CNPJ</th>
                          <th>Status</th>
                        </thead>
                        <tbody>
                          {companyPartners.map((x, index) => (
                            <tr>
                              <td>{x.instituteId}</td>
                              <td>{x.typeName}</td>
                              <td>{x.name}</td>
                              <td>{Functions.formatCnpj(x.instituteDoc)}</td>
                              <td>{x.statusName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {partners && (
                  <div class="company-container">
                    <div class="company-header">
                      Sócio
                    </div>
                    <div class="company-table-body">
                      <table class="table-company">
                        <thead>
                          <th>ID</th>
                          <th>Nome</th>
                          <th>Documento</th>
                          <th>Tipo</th>
                          <th>Qualificação</th>
                          <th>Documento do Representante</th>
                          <th>Representante</th>
                          <th>Faixa Etária</th>
                          <th>Documento da Empresa</th>
                          <th>Data de Registro</th>
                        </thead>
                        <tbody>
                          {partners.map((x, index) => (
                            <tr>
                              <td>{x.partnerId}</td>
                              <td>{x.name}</td>
                              <td>{x.doc}</td>
                              <td>{x.typeName}</td>
                              <td>{x.qualificationName}</td>
                              <td>{x.legalRepresentativeDoc}</td>
                              <td>{x.legalRepresentativeName}</td>
                              <td>{x.ageRangeName}</td>
                              <td>{Functions.formatCnpj(x.companyDoc)}</td>
                              <td>{Functions.formatNumberToData(x.dateRegistration)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {companyDuplicateEmail && (
                  <div class="company-container">
                    <div class="company-header">
                      Empresas com Email Duplicado
                    </div>
                    <div class="company-table-body">
                      <table class="table-company">
                        <thead>
                          <th>ID</th>
                          <th>CNPJ</th>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>Status</th>
                          <th>Email</th>
                        </thead>
                        <tbody>
                          {companyDuplicateEmail.map((x, index) => (
                            <tr>
                              <td>{x.instituteId}</td>
                              <td>{Functions.formatCnpj(x.instituteDoc)}</td>
                              <td>{x.name}</td>
                              <td>{x.typeName}</td>
                              <td>{x.statusName}</td>
                              <td>{x.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {companyDuplicatePhone && (
                  <div class="company-container">
                    <div class="company-header">
                      Empresas com Telefone Duplicado
                    </div>
                    <div class="company-table-body">
                      <table class="table-company">
                        <thead>
                          <th>ID</th>
                          <th>CNPJ</th>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>Status</th>
                          <th>Telefone</th>
                        </thead>
                        <tbody>
                          {companyDuplicatePhone.map((x, index) => (
                            <tr>
                              <td>{x.instituteId}</td>
                              <td>{Functions.formatCnpj(x.instituteDoc)}</td>
                              <td>{x.name}</td>
                              <td>{x.typeName}</td>
                              <td>{x.statusName}</td>
                              <td>{Functions.formatPhone(x.phoneDDD, x.phoneNumber)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {companyDuplicateZip && (
                  <div class="company-container">
                    <div class="company-header">
                      Empresas com Endereço Duplicado
                    </div>
                    <div class="company-table-body">
                      <table class="table-company">
                        <thead>
                          <th>ID</th>
                          <th>CNPJ</th>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>Status</th>
                          <th>CEP</th>
                          <th>Estado</th>
                          <th>Cidade</th>
                          <th>Bairro</th>
                          <th>Rua</th>
                          <th>Complemento</th>
                        </thead>
                        <tbody>
                          {companyDuplicateZip.map((x, index) => (
                            <tr>
                              <td>{x.instituteId}</td>
                              <td>{Functions.formatCnpj(x.instituteDoc)}</td>
                              <td>{x.name}</td>
                              <td>{x.typeName}</td>
                              <td>{x.statusName}</td>
                              <td>{x.zipCode}</td>
                              <td>{x.addressState}</td>
                              <td>{x.cityName}</td>
                              <td>{x.addressNeighborhood}</td>
                              <td>{x.addressLocalization}</td>
                              <td>{x.addressComplement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
