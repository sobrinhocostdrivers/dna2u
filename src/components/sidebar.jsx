import React from 'react';
import './style.css'
import { FaBars, FaAdjust, FaCog } from "react-icons/fa";
import { MdOutlineShowChart } from "react-icons/md";
import { Sidebar, MenuItem, Menu } from 'react-pro-sidebar';

function SideBar() {
    const listMenus = [
        {
            nome: 'Insights',
            icon: <MdOutlineShowChart size={16}/>
        },
        {
            nome: 'Explorer',
            icon: <FaAdjust size={16}/>
        },
        {
            nome: 'Config',
            icon: <FaCog size={16}/>
        },
    ]
    return (
        <Sidebar className="sidebar-container" width={100}>
            <Menu className='sidebar-menu'>
                <MenuItem className='home-menu'>
                    <div class="sidebar-icon">
                        <FaBars size={16}/>
                    </div>
                </MenuItem>
                {listMenus.map((menu, index) => (
                    <MenuItem key={index} style={{ height:'auto' }}>
                        <div class='sidebar-menu'>
                            <div class="sidebar-icon">
                                {menu.icon}
                            </div>
                            {menu.nome}
                        </div>
                    </MenuItem>
            ))}
            </Menu>
        </Sidebar>
    )
}

export default SideBar;