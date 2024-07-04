import React from 'react';
import './style.css'
import Functions from '../utils/functions'
import { FaRegBuilding } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaAt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaFax } from "react-icons/fa";

function CardCompany(props) {
    const { 
        title,
        type,
        // dados empresa
        instituteDoc,
        tradeName,
        companyName,
        companySizeName,
        // status
        typeName,
        statusName,
        companyCategoryName,
        legalNatureName,
        legalNatureId,
        reasonName,
        companyCategoryId,
        // contato
        ddd,
        phoneNumber,
        ddd2,
        phoneNumber2,
        dddFax,
        fax,
        email
    } = props;

    const returnCompanyCategoryIdColor = () => {
        let idString = companyCategoryId.toString()
        let firstTwoDigits = idString.slice(0,2)

        return firstTwoDigits == '86' ? 'green' : ''
    }

    return (
        <div class="card-company">
            <div class="card-company-title bold">
                <div class="flex-start-center">
                    {(type == 'dados') && (
                        <FaRegBuilding size={20} color={'#6470d6'} />
                    )}
                    {(type == 'status') && (
                        <FaCheckCircle size={20} color={"#c36d3e"}/>
                    )}
                    {(type == 'contato') && (
                        <FaEnvelope size={20} color={'#c26f84'}/>
                    )}
                    <div style={{marginLeft: 8}}>{title}</div>
                </div>
                <div
                    style={{ fontSize: 10, color: (type == 'status' && statusName != 'Ativa') ? 'red' : '' }}>
                    {type == 'dados' ? typeName + ' / ' + companySizeName : (type == 'status' ? statusName : '')}
                </div>
            </div>
            <div class="card-company-body">
                <div>
                </div>
                {(type == 'dados') && (
                    <div class="card-company-text-container">
                        <div class='card-company-content bold' style={{marginTop: 0}}>{instituteDoc ? Functions.formatCnpj(instituteDoc) : '-'}</div>
                        <div class='card-company-content bold'>{tradeName ? tradeName : '-'}</div>
                        <div class='card-company-content bold'>{companyName ? companyName : '-'}</div>
                    </div>
                )}
                {(type == 'status') && (
                    <div class="card-company-text-container">
                        <div class='bold card-company-content'
                            style={{marginTop: 0, color: returnCompanyCategoryIdColor()}}>
                            {companyCategoryName ? companyCategoryName : '-'}
                        </div>
                        <div class='bold card-company-content'
                            style={{ color: legalNatureId == 2135 ? 'red' : '' }}>
                            {legalNatureName ? legalNatureName : '-'}
                        </div>
                        <div class='bold card-company-content'>{reasonName ? reasonName : '-'}</div>
                    </div>
                )}
                {(type == 'contato') && (
                    <div class="card-company-text-container">
                        <div class='bold card-company-content flex-start-center' style={{marginTop: 0}}>
                            <FaPhoneAlt size={12}/>
                            <div style={{marginLeft: 8}}>{phoneNumber ? Functions.formatPhone(ddd, phoneNumber) : '-'}</div>
                        </div>
                        <div class='bold card-company-content flex-start-center'>
                            <FaPhoneAlt size={12}/>
                            <div style={{marginLeft: 8}}>{phoneNumber2 ? Functions.formatPhone(ddd2, phoneNumber2) : '-'}</div>
                        </div>
                        <div class='bold card-company-content flex-start-center'>
                            <FaFax size={12}/>
                            <div style={{marginLeft: 8}}>{fax ? Functions.formatPhone(dddFax, fax) : '-'}</div>
                        </div>
                        <div class='bold card-company-content flex-start-center'>
                            <FaAt size={14}/>
                            <div style={{marginLeft: 8}}>{email ? email : '-'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CardCompany;