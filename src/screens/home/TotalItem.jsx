import React from 'react';
import './style.css'

function TotalItem(props) {
    const { icon, title, description, total } = props;

    return (
        <div class="flex-space-between-center total-item">
            <div class="flex-graph-label ">
            {icon}
            <div class="total-label">
                <div class="total-main-text">{title}</div>
                <div class="total-second-text">{description}</div>
            </div>
            </div>
            <div class="total-main-text">{total}</div>
        </div>
    )
}

export default TotalItem;