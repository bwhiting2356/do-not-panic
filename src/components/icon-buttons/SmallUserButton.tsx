
import React from "react";  
import { Person } from "react-bootstrap-icons";

type Props = {
    onClick?: () => void;
    tabIndex?: number;
}

export function SmallUserButton(props: Props) {
    return (
        <button className="small-invisible-button" style={{ width: '25px'}} {...props}>
             <div style={{ width: '25px', marginRight: '20px'}}><Person /></div>
        </button>
    )
}
