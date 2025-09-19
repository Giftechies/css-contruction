"use client"

import {ChartArea } from "lucide-react"



export default function Sidebar(){

const path = [
    {label:"Postcode",path:"/admin/postcode"},
    {label:"Skip size",path:"#"},
    {label:"Details",path:"#"},
]

function Menuitem(  ){
    return(
        <aside className="flex flex-col gap-6 mt-12 " >
            {path.map((el,id)=>{
                return(
                    <a  key={id} href={el.path}>
                        <div className="cursor-pointer" >{el.label}</div>
                    </a>
                )
            })}

        </aside>
    )
}

    return(
        <section className=" w-72 shadow-lg  border-2 h-full p-6   " >
            <h3 className="h4 font-semibold flex gap-2 " ><ChartArea />  Admin Panel</h3>
            <div className="flex ">
                <Menuitem/>

            </div>

        </section>
    )

}