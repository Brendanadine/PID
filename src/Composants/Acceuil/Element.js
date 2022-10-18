import React from "react";

function Element (donnée) {

    console.log("ok");
    return(

        <div>
            <ul>
            {donnée.map((item, index)=>{
            return(
                <>{item.title}{index}</>
            )
          })}
        </ul>
            
        </div>


    )
}

export default Element;