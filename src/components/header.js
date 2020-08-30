import React from "react";
import illustration from "../imgs/webpages.svg";
import Form from "./contact.form";

export default () => (

<header className="bg-gray-300">
    <div className="container mx-auto p-12 max-w-4xl ">
        <div className="flex justify-center items-center">
            <div className="flex-1">
                <h1 className="font-bold text-purple-700 text-6xl">Macorreag</h1>
                <p>Web apps</p>
            </div>
            <img
                src={illustration}
                alt="Persona al lado de una pagina web"
                style={{ height: "300px" }}
            ></img>
        </div>
    <div>
        <Form></Form>
    </div>
    </div>
</header>
)
