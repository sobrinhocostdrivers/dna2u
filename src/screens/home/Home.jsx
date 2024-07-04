import React, { useState } from 'react';
import { CNPJ_MASK } from '../../utils/constants'
import './style.css'
import Functions from '../../utils/functions'
import DashboardService from '../../services/dashboard.service';
import Loader from '../../components/loader'
import SideBar from '../../components/sidebar'
import TopBar from '../../components/topbar'
import CardCompany from '../../components/cardCompany'
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { FaSearch, FaUser, FaUserAltSlash , FaGlobeAmericas, FaPhoneAlt, FaAt, FaCircle  } from "react-icons/fa";
import { Row, Col } from 'react-bootstrap';
import { MdHome } from "react-icons/md";
import { BiSolidBuildingHouse, BiSolidBuilding  } from "react-icons/bi";
import { PieChart } from 'react-minimal-pie-chart';
import TotalItem from './TotalItem'

function Home() {
  const [cnpj, setCnpj] = useState('');
  const [invalidCnpj, setInvalidCnpj] = useState(false)
  const [loading, setLoading] = useState(false)
  const [institute, setInstitute] = useState(null)
  const [partners, setPartners] = useState([])
  const [companyPartners, setCompanyPartners] = useState([])
  const [companyTotals, setCompanyTotals] = useState({
    totalAddress: 0,
    totalEmail: 0,
    totalPhone: 0,
    total: 0
  })
  const [companyDuplicatePhone, setCompanyDuplicatePhone] = useState([])
  const [companyDuplicateZip, setCompnayDuplicateZip] = useState([])
  const [companyDuplicateEmail, setCompanyDuplicateEmail] = useState([])
  const [totalType, setTotalType] = useState('total')

  const iconPersonType = [
    <FaUser />,
    <FaUserAltSlash />,
    <FaGlobeAmericas />
  ]

  const iconCompanySize = [
    <MdHome size={24}/>,
    <BiSolidBuilding size={24} />,
    <BiSolidBuildingHouse size={24} />
  ]

  const handlePesquisarCnpj = async () => {
    setLoading(true)
    setInstitute(null)
    setPartners([])
    setCompanyPartners([])
    setCompanyDuplicateEmail([])
    setCompanyDuplicatePhone([])
    setCompnayDuplicateZip([])
    setCompanyTotals({
      totalAddress: 0,
      totalEmail: 0,
      totalPhone: 0,
      total: 0
    })

    if(Functions.validarCnpj(cnpj)) {
      try {
        const cnpjNumbers = cnpj.replace(/\D/g,'');
        const response = await DashboardService.getByDoc(cnpjNumbers)
        if(response.data) {
          setInstitute(response.data)
          const objTotals = {
            email: response.data.email,
            phoneDDD: response.data.phoneDDD,
            phoneNumber: response.data.phoneNumber,
            zipCode: response.data.addressZipCode,
            addressNumber: response.data.addressNumber,
            companyId: response.data.companyId
          }

          const responsePartner = await DashboardService.getPartner(response.data.companyDoc)
          const responseCompanyPartner = await DashboardService.getCompanyPartner(response.data.companyDoc)
          const responseTotals = await DashboardService.getTotals(objTotals)

          setPartners(responsePartner.data)
          setCompanyPartners(responseCompanyPartner.data)
          setCompanyTotals({
            totalAddress: responseTotals.data.totalAddress,
            totalEmail: responseTotals.data.totalEmail,
            totalPhone: responseTotals.data.totalPhone,
            total: responseTotals.data.totalAddress + responseTotals.data.totalEmail + responseTotals.data.totalPhone
          })
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

  const returnPersonTypeIcon = (tipo) => {
    if(tipo = 'Pessoa Física') {
      return iconPersonType[0]
    } else if (tipo = 'Pessoa Júridica') {
      return iconPersonType[1]
    } else if (tipo = 'Estrangeiro') {
      return iconPersonType[2]
    } else {
      return ''
    }
  }

  const returnCompanySizeIcon = (tipo) => {
    if (tipo = 'Micro Empresa') {
      return iconCompanySize[0]
    } else if (tipo = 'Empresa de Pequeno Porte') {
      return iconCompanySize[1]
    } else if (tipo = 'Outros Tipos de Empresa') {
      return iconCompanySize[2]
    } else {
      return ''
    }
  }

  const returnTotalTitle = () => {
    if (totalType == 'total') {
      return 'Totais'
    } else if (totalType == 'endereco') {
      return 'Endereço'
    } else if (totalType == 'telefone') {
      return 'Telefone'
    } else if (totalType == 'email') {
      return 'Email'
    } else {
      return ''
    }
  }

  const handlePesquisarTotals = async (type) => {
    if(type != totalType) {
      setLoading(true)
      setCompanyDuplicateEmail([])
      setCompanyDuplicatePhone([])
      setCompnayDuplicateZip([])
      try {
        setTotalType(type)
        let response = null
        let obj = {}
        if(type == 'endereco') {
          obj = {
            zipCode: institute.addressZipCode,
            addressNumber: institute.addressNumber,
            companyId: institute.companyId
          }
          response = await DashboardService.getDuplicateCep(obj)
          if(response.data) {
            setCompnayDuplicateZip(response.data)
          }
        } else if (type == 'telefone') {
          obj = {
            phoneDDD: institute.phoneDDD,
            phoneNumber: institute.phoneNumber,
            companyId: institute.companyId
          }
          response = await DashboardService.getDuplicatePhone(obj)
          if(response.data) {
            setCompanyDuplicatePhone(response.data)
          }
        } else if (type == 'email') {
          obj = {
            email: institute.email,
            companyId: institute.companyId
          }
          response = await DashboardService.getDuplicateEmail(obj)
          if(response.data) {
            setCompanyDuplicateEmail(response.data)
          }
        } 
      } catch {}
      finally {
        setLoading(false)
      }
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
                <Row>
                  <Col md={12} lg={8}>
                    {(institute !== null) && (
                      <>
                        {/* Cards Compnay */}
                        <Row>
                          <Col sm={12} md={4} className="company-card-container">
                            <CardCompany
                              type='dados'
                              title={'Empresa'}
                              instituteDoc={institute.instituteDoc}
                              tradeName={institute.tradeName}
                              companyName={institute.companyName}
                              companySizeName={institute.companySizeName}
                              typeName={institute.typeName}
                              statusName={institute.statusName}
                              companyCategoryName={institute.companyCategoryName}
                              legalNatureName={institute.legalNatureName}
                              legalNatureId={institute.legalNatureId}
                              companyCategoryId={institute.companyCategoryId}
                              reasonName={institute.reasonName}
                              ddd={institute.phoneDDD}
                              phoneNumber={institute.phoneNumber}
                              ddd2={institute.phoneDDDTwo}
                              phoneNumber2={institute.phoneNumberTwo}
                              dddFax={institute.faxDDD}
                              fax={institute.faxNumber}
                              email={institute.email}
                            />
                          </Col>
                          <Col sm={12} md={4} className="company-card-container">
                            <CardCompany
                              type='status'
                              title={'Status'}
                              instituteDoc={institute.instituteDoc}
                              tradeName={institute.tradeName}
                              companyName={institute.companyName}
                              companySizeName={institute.companySizeName}
                              typeName={institute.typeName}
                              statusName={institute.statusName}
                              companyCategoryName={institute.companyCategoryName}
                              legalNatureName={institute.legalNatureName}
                              legalNatureId={institute.legalNatureId}
                              companyCategoryId={institute.companyCategoryId}
                              reasonName={institute.reasonName}
                              ddd={institute.phoneDDD}
                              phoneNumber={institute.phoneNumber}
                              ddd2={institute.phoneDDDTwo}
                              phoneNumber2={institute.phoneNumberTwo}
                              dddFax={institute.faxDDD}
                              fax={institute.faxNumber}
                              email={institute.email}
                            />
                          </Col>
                          <Col sm={12} md={4} className="company-card-container">
                            <CardCompany
                              type='contato'
                              title={'Contato'}
                              instituteDoc={institute.instituteDoc}
                              tradeName={institute.tradeName}
                              companyName={institute.companyName}
                              companySizeName={institute.companySizeName}
                              typeName={institute.typeName}
                              statusName={institute.statusName}
                              companyCategoryName={institute.companyCategoryName}
                              legalNatureName={institute.legalNatureName}
                              legalNatureId={institute.legalNatureId}
                              companyCategoryId={institute.companyCategoryId}
                              reasonName={institute.reasonName}
                              ddd={institute.phoneDDD}
                              phoneNumber={institute.phoneNumber}
                              ddd2={institute.phoneDDDTwo}
                              phoneNumber2={institute.phoneNumberTwo}
                              dddFax={institute.faxDDD}
                              fax={institute.faxNumber}
                              email={institute.email}
                            />
                          </Col>
                        </Row>
                        {/* Dados Complementares */}
                        <Row>
                          <Col xs={12}>
                            <div class="company-container">
                              <div class="company-header">
                                Dados Complementares
                              </div>
                              <div class="company-body">
                                <Row>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Data Status</div>
                                    <div class="company-section-text">{Functions.formatNumberToData(institute.dateStatus)}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title company-section-title2">Data Atividade</div>
                                    <div class="company-section-text">{Functions.formatNumberToData(institute.dateActivity)}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title company-section-title3">Data Status Especial</div>
                                    <div class="company-section-text">{institute.dataSpecialStatus ? Functions.formatNumberToData(institute.dataSpecialStatus) : ''}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Status Especial</div>
                                    <div class="company-section-text">{institute.specialStatus}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={8} className='company-section'>
                                    <div class="company-section-title">Outras Categorias Id</div>
                                    <div class="company-section-text">{institute.otherCompanyCategorId}</div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Estado</div>
                                    <div class="company-section-text">{institute.addressState}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Cidade</div>
                                    <div class="company-section-text">{institute.cityName}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Bairro</div>
                                    <div class="company-section-text">{institute.addressNeighborhood}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={8} className='company-section'>
                                    <div class="company-section-title">Endereço</div>
                                    <div class="company-section-text">{institute.addressTypeId + ' ' + institute.addressLocalization}</div>
                                  </Col>
                                  <Col sm={12} md={6} lg={4} className='company-section'>
                                    <div class="company-section-title">Complemento</div>
                                    <div class="company-section-text">{institute.addressComplement}</div>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                  <Col xs={12} lg={4}>
                    {(institute !== null) && (
                      <>
                        <Row style={{ height: '100%' }}>
                          <Col xs={12} style={{ height: '100%' }}>
                            <div div class="graphic-container">
                              <div>
                                <div class="graph-title">Estatisticas - Duplicidade por contato</div>
                                <div class="graph-container">
                                  <PieChart
                                    data={[
                                      { title: 'Endereço', value: companyTotals.totalAddress, color: '#ff678a' },
                                      { title: 'Email', value: companyTotals.totalEmail, color: '#52beff' },
                                      { title: 'Telefone', value: companyTotals.totalPhone, color: '#fedd68' },
                                    ]}
                                    lineWidth={20}
                                    totalValue={companyTotals.total}
                                    label={({ dataEntry }) => '100%'}
                                    labelStyle={{ fontSize: 8}}
                                    labelPosition={0}
                                  />
                                </div>
                              </div>
                              <div style={{ width: '100%' }}>
                                <div class="flex-space-between-center graph-data">
                                  <div class="flex-graph-label">
                                    <div class="ball" style={{ backgroundColor: "#ff678a" }}></div>
                                    <div class="graph-label">Endereço</div>
                                  </div>
                                  <div class="graph-number">{companyTotals.totalAddress}</div>
                                </div>

                                <div class="flex-space-between-center graph-data">
                                  <div class="flex-graph-label">
                                    <div class="ball" style={{ backgroundColor: "#52beff" }}></div>
                                    <div class="graph-label">Email</div>
                                  </div>
                                  <div class="graph-number">{companyTotals.totalEmail}</div>
                                </div>

                                <div class="flex-space-between-center graph-data" style={{ borderBottom: 'none' }}>
                                  <div class="flex-graph-label">
                                    <div class="ball" style={{ backgroundColor: "#fedd68" }}></div>
                                    <div class="graph-label">Telefone</div>
                                  </div>
                                  <div class="graph-number">{companyTotals.totalPhone}</div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={12} lg={8}>
                    {(institute !== null) && (
                      <>
                        <div class="company-container company-table-container">
                          <Row>
                            {/* Sócio */}
                            <Col sm={12} md={6} className="company-table-first"  style={{ paddingTop: 15, paddingBottom: 15 }}>
                              <div class="company-table-main-text">Sócios</div>
                              {partners.length > 0 && (
                                <table class="company-table">
                                  <tbody>
                                    {partners.map((item) => (
                                      <tr>
                                        <td>
                                          {returnPersonTypeIcon(item.typeName)}
                                        </td>
                                        <td>
                                          <div class="company-table-td">
                                            <div class="company-table-main-text">{item.name}</div>
                                            <div class="company-table-second-text">{item.typeName}</div>
                                          </div>
                                        </td>
                                        <td>
                                          <div class="company-table-td">
                                            <div class="company-table-main-text">{item.qualificationName}</div>
                                            <div class="company-table-second-text">{item.ageRangeName}</div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </Col>
                            {/* Empresa Sócio */}
                            <Col sm={12} md={6}  style={{ paddingTop: 15, paddingBottom: 15 }}>
                              <div class="company-table-main-text">Outras Empresas do Sócio</div>
                              {companyPartners.length > 0 && (
                                <table class="company-table">
                                  <tbody>
                                    {companyPartners.map((item) => (
                                      <tr>
                                        <td>{returnCompanySizeIcon(item.companySizeName)}</td>
                                        <td>
                                          <div class="company-table-td">
                                            <div class="company-table-main-text">{item.companyName}</div>
                                            <div class="company-table-second-text">{item.companySizeName}</div>
                                          </div>
                                        </td>
                                        <td>
                                          <div class="company-table-td">
                                            <div class="company-table-main-text">{item.partnerName}</div>
                                            <div class="company-table-second-text">{Functions.formatNumberToCurrency(item.shareCapitalValue)}</div>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={12} lg={4}>
                    {(institute !== null) && (
                      <Row>
                        <Col xs={12}>
                          <div class="list-total-container">
                            <div>
                              <div class="graph-title">{returnTotalTitle()}</div>
                              <Row>
                                <Col xs={3}>
                                  <div class={totalType == 'total' ? 'total-btn-active' : 'total-btn'} onClick={() => {handlePesquisarTotals('total')}}>
                                    <FaCircle  size={16}/>
                                    <div class="total-label-btn">Totais</div>
                                  </div>
                                </Col>
                                <Col xs={3}>
                                  <div class={totalType == 'endereco' ? 'total-btn-active' : 'total-btn'} onClick={() => {handlePesquisarTotals('endereco')}}>
                                    <BiSolidBuildingHouse size={16}/>
                                    <div class="total-label-btn">Endereço</div>
                                  </div>
                                </Col>
                                <Col xs={3}>
                                  <div class={totalType == 'email' ? 'total-btn-active' : 'total-btn'} onClick={() => {handlePesquisarTotals('email')}}>
                                    <FaAt size={16}/>
                                    <div class="total-label-btn">Email</div>
                                  </div>
                                </Col>
                                <Col xs={3}>
                                  <div class={totalType == 'telefone' ? 'total-btn-active' : 'total-btn'} onClick={() => {handlePesquisarTotals('telefone')}}>
                                    <FaPhoneAlt size={16}/>
                                    <div class="total-label-btn">Telefone</div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            {totalType == 'total' && (
                              <div>
                                <TotalItem
                                  icon={<BiSolidBuildingHouse size={22}/>}
                                  title={'Endereço'}
                                  description={institute.addressZipCode ? `${Functions.formatCep(institute.addressZipCode)} ${institute.addressNumber}` : '-'}
                                  total={companyTotals.totalAddress}
                                />
                                <TotalItem
                                  icon={<FaAt size={22}/>}
                                  title={'Email'}
                                  description={institute.email ? institute.email : '-'}
                                  total={companyTotals.totalEmail}
                                />
                                <TotalItem
                                  icon={<FaPhoneAlt size={22}/>}
                                  title={'Telefone'}
                                  description={institute.phoneNumber ? Functions.formatPhone(institute.phoneDDD, institute.phoneNumber) : '-'}
                                  total={companyTotals.totalPhone}
                                />
                              </div>
                            )}
                            {totalType == 'endereco' && (
                              <div>
                                {companyDuplicateZip.map((item) => (
                                  <div class="total-item">
                                    <Row>
                                      <Col xs={2}>
                                        <div class="duplicate-item-container" style={{ alignItems: 'center' }}>{returnCompanySizeIcon(item.companySizeName)}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-main-text">{Functions.formatCnpj(item.instituteDoc)}</div>
                                        <div class="duplicate-main-text" style={{marginBottom: '0.4em'}}>{item.companyName}</div>
                                        <div class="duplicate-second-text">{item.tradeName}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-item-container">
                                          <div class="duplicate-main-text">{institute.addressZipCode ? Functions.formatCep(institute.addressZipCode) : '-'}</div>
                                          <div class="duplicate-second-text">{institute.addressNumber ? institute.addressNumber : '-'}</div>
                                          <div class="duplicate-second-text">{institute.addressComplement ? institute.addressComplement : '-'}</div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                ))}
                              </div>
                            )}
                            {totalType == 'email' && (
                              <div>
                                {companyDuplicateEmail.map((item) => (
                                  <div class="total-item">
                                    <Row>
                                      <Col xs={2}>
                                        <div class="duplicate-item-container" style={{ alignItems: 'center' }}>{returnCompanySizeIcon(item.companySizeName)}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-main-text">{Functions.formatCnpj(item.instituteDoc)}</div>
                                        <div class="duplicate-main-text" style={{marginBottom: '0.4em'}}>{item.companyName}</div>
                                        <div class="duplicate-second-text">{item.tradeName}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-main-text duplicate-item-container">{institute.email ?institute.email : '-'}</div>
                                      </Col>
                                    </Row>
                                  </div>
                                ))}
                              </div>
                            )}
                            {totalType == 'telefone' && (
                              <div>
                                {companyDuplicatePhone.map((item) => (
                                  <div class="total-item">
                                    <Row>
                                      <Col xs={2}>
                                        <div class="duplicate-item-container" style={{ alignItems: 'center' }}>{returnCompanySizeIcon(item.companySizeName)}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-main-text">{Functions.formatCnpj(item.instituteDoc)}</div>
                                        <div class="duplicate-main-text" style={{marginBottom: '0.4em'}}>{item.companyName}</div>
                                        <div class="duplicate-second-text">{item.tradeName}</div>
                                      </Col>
                                      <Col xs={5}>
                                        <div class="duplicate-main-text duplicate-item-container">{institute.phoneNumber ? Functions.formatPhone(institute.phoneDDD, institute.phoneNumber) : '-'}</div>
                                      </Col>
                                    </Row>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
